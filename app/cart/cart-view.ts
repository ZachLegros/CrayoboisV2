import { type DbProduct, getHardwareId, getMaterialId } from "@/lib/productUtils";
import {
  getTps,
  getTvq,
  safeLocalStorageGet,
  safeLocalStorageSet,
} from "@/lib/utils";
import { fetchShippingMethods, syncCart as syncCartAction } from "./actions";
import type {
  CartItemData,
  CartItemType,
  CartItems,
  CartProductType,
  CartState,
} from "./types";
import { isShippingFree } from "./utils";

export class Cart {
  private state: CartState = {
    items: [],
    itemData: {},
    shipping: null,
    shippingMethods: [],
    breakdown: {
      subtotal: 0,
      tps: 0,
      tvq: 0,
      shipping: 0,
      total: 0,
    },
  };
  onStateChange: (state: CartState) => void;

  constructor(onStateChange: (state: CartState) => void) {
    this.state.items = this.getCartFromLocalStorage();
    this.state.itemData = this.getCartItemDataFromLocalStorage();
    this.onStateChange = onStateChange;
  }

  private setState = (state: Partial<CartState>) => {
    this.state = { ...this.state, ...state };
    this.onStateChange(this.state);
  };

  getState = () => {
    return { ...this.state };
  };

  private setItems = (items: CartItems) => {
    this.setState({ items });
    this.setItemsInLocalStorage(items);
  };

  private setItemData = (itemData: CartItemData) => {
    this.setState({ itemData });
    this.inferShippingMethod();
    this.inferBreakdown();
    this.setItemDataInLocalStorage(itemData);
  };

  addItem = (product: DbProduct) => {
    const alreadyInCart = this.has(product.id);
    if (alreadyInCart) return;
    const newCartItems = [
      ...this.state.items,
      {
        product: {
          id: product.id,
          material_id: getMaterialId(product),
          hardware_id: getHardwareId(product),
        },
        quantity: 1,
      },
    ];
    const newCartItemData = { ...this.state.itemData, [product.id]: product };
    this.setItems(newCartItems);
    this.setItemData(newCartItemData);
  };

  removeItem = (productId: string) => {
    const newCartItems = this.state.items.filter(
      (item) => item.product.id !== productId,
    );
    const newCartItemData = {
      ...this.state.itemData,
      [productId]: undefined,
    };
    this.setItems(newCartItems);
    this.setItemData(newCartItemData);
  };

  updateItem = <P extends keyof CartItemType<CartProductType>>(
    productId: string,
    property: P,
    value: CartItemType<CartProductType>[P],
  ) => {
    const newCartItems: CartItems = [...this.state.items].map((item) =>
      item.product.id === productId ? { ...item, [property]: value } : item,
    );
    this.setItems(newCartItems);
    this.inferShippingMethod();
    this.inferBreakdown();
  };

  has = (productId: string) => {
    return this.state.items.some((item) => item.product.id === productId);
  };

  clear = () => {
    this.setItems([]);
    this.setItemData({});
  };

  getTotalItemsPrice = () => {
    return this.state.items.reduce((acc, item) => {
      const product = this.state.itemData[item.product.id];
      if (product === undefined) return acc;
      return acc + product.price * item.quantity;
    }, 0);
  };

  getTotalQuantity = () => {
    return this.state.items.reduce((acc, item) => acc + item.quantity, 0);
  };

  private inferBreakdown = () => {
    if (!this.state.shipping) {
      this.setState({
        breakdown: {
          subtotal: 0,
          tps: 0,
          tvq: 0,
          shipping: 0,
          total: 0,
        },
      });
      return;
    }
    const subtotal = this.getTotalItemsPrice();
    const tps = getTps(subtotal);
    const tvq = getTvq(subtotal);
    const shippingPrice = this.state.shipping.price;
    this.setState({
      breakdown: {
        subtotal,
        tps,
        tvq,
        shipping: shippingPrice,
        total: subtotal + tps + tvq + shippingPrice,
      },
    });
  };

  sync = async () => {
    const lastSync = parseInt(safeLocalStorageGet("lastSync") ?? "0");
    if (lastSync && Date.now() - lastSync < 1000 * 60 * 60) return;

    const syncedCart = await syncCartAction(this.state.items);
    const newCartItems: CartItems = syncedCart.map(({ product, quantity }) => ({
      product: {
        id: product.id,
        material_id: getMaterialId(product),
        hardware_id: getHardwareId(product),
      },
      quantity,
    }));
    const newCartItemData: CartItemData = syncedCart.reduce((acc, { product }) => {
      acc[product.id as keyof CartItemData] = product;
      return acc;
    }, {} as CartItemData);
    safeLocalStorageSet("lastSync", Date.now().toString());
    this.setItems(newCartItems);
    this.setItemData(newCartItemData);
  };

  fetchShippingMethods = async () => {
    const shippingMethods = await fetchShippingMethods();
    this.setState({ shippingMethods });
    this.inferShippingMethod();
    this.inferBreakdown();
  };

  setShippingMethod = (id: string) => {
    const correspondingMethod = this.state.shippingMethods.find(
      (item) => item.id === id,
    );
    this.setState({ shipping: correspondingMethod ?? null });
    this.inferBreakdown();
  };

  private inferShippingMethod = () => {
    const freeMethod = this.state.shippingMethods.filter(
      (method) => method.price === 0,
    )[0];
    const nonFreeMethods = this.state.shippingMethods
      .filter((method) => method.price !== 0)
      .sort((a, b) => a.price - b.price);

    if (isShippingFree(this.getTotalQuantity(), this.getTotalItemsPrice())) {
      this.setState({ shipping: freeMethod });
      return;
    }
    this.setState({ shipping: nonFreeMethods[0] });
  };

  private getCartFromLocalStorage = (): CartItems => {
    const cartString = safeLocalStorageGet("cart");
    const cart: CartItems = cartString ? JSON.parse(cartString) : [];
    return cart;
  };

  private getCartItemDataFromLocalStorage = (): CartItemData => {
    const itemDataString = safeLocalStorageGet("itemData");
    const itemData = itemDataString ? JSON.parse(itemDataString) : {};
    return itemData;
  };

  private setItemsInLocalStorage = (items: CartItems) => {
    safeLocalStorageSet("cart", JSON.stringify(items));
  };

  private setItemDataInLocalStorage = (itemData: CartItemData) => {
    safeLocalStorageSet("itemData", JSON.stringify(itemData));
  };
}
