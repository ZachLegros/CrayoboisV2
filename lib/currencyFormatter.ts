const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CAD",
  currencyDisplay: "narrowSymbol",
});

export const cad = (amount: number) => {
  return formatter.format(amount);
};

export const cadPrecision = (amount: number) => {
  return parseFloat(amount.toFixed(2));
};
