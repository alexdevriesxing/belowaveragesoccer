(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.FmcgMarginCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function n(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  function calculate(input) {
    const units = n(input.units);
    const price = n(input.price);
    const gross = units * price;
    const discount = gross * n(input.discountPct) / 100;
    const revenue = gross - discount;
    const feeRate = (
      n(input.platformFee) +
      n(input.serviceFee) +
      n(input.affiliateFee) +
      n(input.otherFeePct)
    ) / 100;
    const variableFees = revenue * feeRate;
    const fulfilment = n(input.fulfilment);
    const ads = n(input.ads);
    const shipping = n(input.shipping);
    const otherFixed = n(input.otherFixed);
    const fixedCosts = fulfilment + ads + shipping + otherFixed;
    const cogs = units * n(input.cogs);
    const tax = input.taxOn ? n(input.taxBase) * 0.005 : 0;
    const taxAsCost = input.taxTreatment === "final" ? tax : 0;
    const profit = revenue - variableFees - fixedCosts - cogs - taxAsCost;
    const margin = revenue > 0 ? profit / revenue * 100 : 0;
    const settlement = revenue - variableFees - fulfilment - shipping - otherFixed - tax;
    const denominator =
      (1 - n(input.discountPct) / 100) * (1 - feeRate) -
      (input.taxOn && input.taxTreatment === "final" ? 0.005 : 0);
    const breakEvenOrder = denominator > 0 ? (fixedCosts + cogs) / denominator : 0;
    const breakEvenUnit = units > 0 ? breakEvenOrder / units : 0;

    return {
      units,
      price,
      gross,
      discount,
      revenue,
      feeRate,
      variableFees,
      fixedCosts,
      cogs,
      tax,
      taxAsCost,
      profit,
      margin,
      settlement,
      breakEvenUnit
    };
  }

  return { calculate };
});
