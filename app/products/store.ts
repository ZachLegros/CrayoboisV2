import { create } from "zustand";
import { Filter, PriceFilterValue, createFilter } from "../custom-order/store";

const getInitialPriceFilter = (): PriceFilterValue => "desc";

export type ProductsStore = {
  priceFilter: Filter;
  clearFilters: () => void;
  reset: () => void;
};

export const useProductsStore = create<ProductsStore>((set, state) => ({
  priceFilter: createFilter(set, "priceFilter", true, getInitialPriceFilter),
  clearFilters: () => {
    state().priceFilter.clear();
  },
  reset: () => {
    state().clearFilters();
  },
}));
