const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CAD",
  currencyDisplay: "narrowSymbol",
});

export const cad = (amount: number) => {
  return formatter.format(amount);
};
