import { create } from "zustand";
import { Filter, PriceFilterValue, createFilter } from "../custom-order/store";
import { Product } from "@prisma/client";

const getInitialPriceFilter = (): PriceFilterValue => "desc";

export type ProductsStore = {
  products: readonly Product[];
  setProducts: (products: Product[]) => void;
  priceFilter: Filter;
  clearFilters: () => void;
  reset: () => void;
};

export const useProductsStore = create<ProductsStore>((set, state) => ({
  products: [],
  setProducts: (products: Product[]) => {
    set({ products });
  },
  priceFilter: createFilter(set, "priceFilter", true, getInitialPriceFilter),
  clearFilters: () => {
    state().priceFilter.clear();
  },
  reset: () => {
    state().clearFilters();
  },
}));
