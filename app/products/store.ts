import type { Product } from "@prisma/client";
import { create } from "zustand";
import {
  type Filter,
  type PriceFilterValue,
  createFilter,
} from "../custom-order/store";

const getInitialPriceFilter = (): PriceFilterValue => "desc";

export type ProductsStore = {
  products: readonly Product[];
  setProducts: (products: Product[]) => void;
  priceFilter: Filter;
  clearFilters: () => void;
  reset: () => void;
};

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  setProducts: (products: Product[]) => {
    set({ products });
  },
  priceFilter: createFilter({
    set,
    get,
    filterKey: "priceFilter",
    enabled: true,
    initialValue: getInitialPriceFilter(),
  }),
  clearFilters: () => {
    get().priceFilter.clear();
  },
  reset: () => {
    get().clearFilters();
  },
}));
