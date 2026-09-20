const assert = require("node:assert/strict");
const { calculate } = require("../web/calculator-core.js");

const base = {
  units: 1,
  price: 50000,
  discountPct: 5,
  cogs: 22000,
  platformFee: 6,
  serviceFee: 2,
  affiliateFee: 0,
  otherFeePct: 0,
  fulfilment: 2500,
  ads: 3500,
  shipping: 2000,
  otherFixed: 0,
  taxBase: 50000,
  taxOn: true,
  taxTreatment: "final"
};

const finalTax = calculate(base);
assert.equal(finalTax.gross, 50000);
assert.equal(finalTax.discount, 2500);
assert.equal(finalTax.revenue, 47500);
assert.equal(finalTax.variableFees, 3800);
assert.equal(finalTax.tax, 250);
assert.equal(finalTax.profit, 13450);
assert.equal(finalTax.settlement, 38950);
assert.ok(Math.abs(finalTax.margin - 28.31578947368421) < 1e-9);

const creditable = calculate({ ...base, taxTreatment: "credit" });
assert.equal(creditable.tax, 250);
assert.equal(creditable.profit, 13700);
assert.equal(creditable.settlement, 38950);

const exempt = calculate({ ...base, taxOn: false });
assert.equal(exempt.tax, 0);
assert.equal(exempt.profit, 13700);
assert.equal(exempt.settlement, 39200);

const twoUnits = calculate({ ...base, units: 2, price: 30000, cogs: 12000, taxBase: 60000 });
assert.equal(twoUnits.gross, 60000);
assert.equal(twoUnits.cogs, 24000);
assert.equal(twoUnits.tax, 300);
assert.ok(Number.isFinite(twoUnits.breakEvenUnit));

console.log("Marketplace margin calculator core tests passed.");
