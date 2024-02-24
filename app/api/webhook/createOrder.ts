import prisma from "@/lib/prisma";
import type { CustomProduct } from "@/lib/productUtils";
import { getTps, getTvq } from "@/lib/utils";
import type {
  ClientOrder,
  CustomProduct as PrismaCustomProduct,
  Hardware,
  Material,
  Product,
} from "@prisma/client";
import type Stripe from "stripe";
import { deleteCheckoutSessionInDB, orZero } from "../utils";

type OrderMaterial = {
  id: Material["id"];
  name: Material["name"];
  price: Material["price"];
  image: Material["image"];
};

type OrderHardware = {
  id: Hardware["id"];
  name: Hardware["name"];
  price: Hardware["price"];
  image: Hardware["image"];
};

type OrderProduct = {
  id: Product["id"];
  name: Product["name"];
  price: Product["price"];
  image: Product["image"];
} & { quantity: number };

type CustomProductWithOrderComponents = CustomProduct<{
  material: OrderMaterial;
  hardware: OrderHardware;
}>;

export async function handleSuccess(event: Stripe.CheckoutSessionCompletedEvent) {
  const checkoutSessionId = event.data.object.id;
  console.log("Checkout session completed:", checkoutSessionId);
  setCheckoutSessionCompleted(checkoutSessionId);
  const order = await createOrder(event);
  if (!order) throw new Error("Order not created");
  return new Response(JSON.stringify({ order_id: order.id }), { status: 200 });
}

export async function handleExpire(event: Stripe.CheckoutSessionExpiredEvent) {
  const checkoutSid = event.data.object.id;
  console.log("Checkout session expired:", checkoutSid);
  await deleteCheckoutSessionInDB(checkoutSid);
  return new Response(null, { status: 200 });
}

async function setCheckoutSessionCompleted(checkoutSid: string) {
  return prisma.checkoutSession.update({
    where: { sid: checkoutSid },
    data: { status: "completed" },
  });
}

async function createOrder(event: Stripe.CheckoutSessionCompletedEvent) {
  try {
    const customerDetails = event.data.object.customer_details;
    const email = customerDetails?.email;
    const name = customerDetails?.name;
    const address = customerDetails?.address;
    const line1 = address?.line1;
    const postal_code = address?.postal_code;
    const city = address?.city;
    const country = address?.country;
    const state = address?.state;
    if (
      !email ||
      !name ||
      !address ||
      !line1 ||
      !postal_code ||
      !city ||
      !country ||
      !state
    )
      throw new Error("Missing customer details");

    const checkoutSession = await prisma.checkoutSession.findUnique({
      where: { sid: event.data.object.id },
      include: { items: true, custom_items: true },
    });
    if (!checkoutSession) throw new Error("Checkout session not found");
    const { items, custom_items, shipping_id, user_id } = checkoutSession;

    // Get shipping object
    const shipping = await prisma.shipping.findUnique({
      where: { id: shipping_id },
    });

    // Get profile id from user id if it exists
    let profileId: string | undefined;
    const profile = await prisma.profile.findMany({
      where: {
        OR: [{ id: user_id as string | undefined }, { email }],
      },
    });
    if (profile[0]) profileId = profile[0].id;

    const total = orZero(event.data.object.amount_subtotal) / 100;
    const totalShipping = orZero(shipping?.price);
    const amount = total - totalShipping;
    const totalTax = orZero(getTps(amount)) + orZero(getTvq(amount));
    console.log(total, totalTax, totalShipping, amount);

    const [products, customProducts]: [
      Partial<OrderProduct>[],
      CustomProductWithOrderComponents[],
    ] = await Promise.all([
      prisma.product.findMany({
        where: {
          id: {
            in: items?.map((item) => item.productId) || [],
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      }),
      prisma.customProduct.findMany({
        where: {
          id: {
            in: custom_items?.map((item) => item.customProductId) || [],
          },
        },
        include: {
          material: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
            },
          },
          hardware: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
            },
          },
        },
      }),
    ]);
    // map item quantity to products
    for (const product of products) {
      const item = items?.find((item) => item.productId === product.id);
      if (item) product.quantity = item.quantity;
      else product.quantity = 1;
    }

    const order = await prisma.clientOrder.create({
      data: {
        products: products,
        custom_products: customProducts,
        payer_email: email,
        payer_name: name,
        address_street: line1,
        address_city: city,
        address_country: country,
        address_zip: postal_code,
        address_state: state,
        shipping: totalShipping,
        amount,
        tax: totalTax,
        user_id: profileId,
      },
    });
    await updateInventory(order);
    console.log("Order created:", order.id);
    return order;
  } catch (error) {
    console.error(error);
  }
}

// update the inventory of the materials and hardware based on the order's custom products
async function updateInventory(order: ClientOrder) {
  try {
    if (!order) throw new Error("Order not found");
    const { custom_products } = order;
    for (const customProduct of custom_products as PrismaCustomProduct[]) {
      const { material_id, hardware_id } = customProduct;
      await prisma.material.update({
        where: { id: material_id },
        data: { quantity: { decrement: customProduct.quantity } },
      });
      await prisma.hardware.update({
        where: { id: hardware_id },
        data: { quantity: { decrement: customProduct.quantity } },
      });
    }
  } catch (error) {
    console.error(error);
  }
}
