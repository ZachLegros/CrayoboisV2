import type { Product } from "@prisma/client";
import { create } from "zustand";
import { Filter, type PriceFilterValue } from "../custom-order/store";

const getInitialPriceFilter = (): PriceFilterValue => "desc";

export type ProductsStore = {
  products: readonly Product[];
  setProducts: (products: Product[]) => void;
  priceFilter: Filter<PriceFilterValue>;
  clearFilters: () => void;
  reset: () => void;
};

export const useProductsStore = create<ProductsStore>((set, state) => ({
  products: [],
  setProducts: (products: Product[]) => {
    set({ products });
  },
  priceFilter: new Filter({ value: getInitialPriceFilter(), enabled: true }),
  clearFilters: () => {
    state().priceFilter.clear();
  },
  reset: () => {
    state().clearFilters();
  },
}));
