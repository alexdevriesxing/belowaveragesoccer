(function () {
  "use strict";

  const core = window.FmcgMarginCore;
  const byId = (id) => document.getElementById(id);
  const numericIds = [
    "units", "price", "discountPct", "cogs", "platformFee", "serviceFee",
    "affiliateFee", "otherFeePct", "fulfilment", "ads", "shipping", "otherFixed", "taxBase"
  ];
  let language = "en";

  const copy = {
    en: {
      title: "Indonesia Marketplace Margin Calculator",
      subtitle: "See what remains after marketplace fees, discounts, fulfilment, advertising, logistics and PPh 22.",
      badge: "FMCG by Alex • Free commercial tool",
      setup: "Order setup",
      marketplace: "Marketplace",
      units: "Units per order",
      price: "Selling price per unit",
      discount: "Seller-funded discount",
      costs: "Costs & fees",
      cogs: "COGS per unit",
      platform: "Marketplace fee",
      service: "Service / admin fee",
      affiliate: "Affiliate / creator fee",
      otherPercent: "Other percentage fees",
      fulfilment: "Fulfilment per order",
      ads: "Advertising / acquisition",
      shipping: "Seller shipping support",
      otherFixed: "Other fixed order costs",
      tax: "Tax treatment",
      modelTax: "Model PPh 22 withholding",
      modelTaxHint: "Turn this off only when the seller / transaction is outside collection.",
      taxBase: "Taxable gross turnover",
      treatment: "How to treat the 0.5%",
      final: "Final-tax cost",
      credit: "Creditable withholding",
      results: "Commercial result",
      contribution: "Contribution profit",
      margin: "Contribution margin",
      settlement: "Estimated settlement cash",
      withheld: "PPh 22 withheld",
      breakeven: "Break-even price / unit",
      gross: "Gross order value",
      revenue: "Net customer revenue",
      fees: "Marketplace percentage fees",
      fixed: "Fulfilment + ads + shipping + fixed",
      cogsOut: "COGS",
      taxOut: "PPh 22 impact",
      reset: "Reset example",
      export: "Export CSV",
      healthy: "Healthy unit economics",
      thin: "Thin margin — watch promo spend",
      risk: "Margin at risk",
      finalNote: "Final-tax treatment: the 0.5% is included as an economic cost in contribution profit.",
      creditNote: "Creditable treatment: the 0.5% reduces settlement cash here but is not counted as an incremental SKU operating cost.",
      offNote: "No PPh 22 withholding is modelled. Confirm the seller or transaction is outside collection.",
      foot: "Planning tool only. Verify your actual marketplace fee structure and tax treatment with qualified advisers.",
      powered: "Technology by Sakura • Commercial context by FMCG by Alex"
    },
    id: {
      title: "Kalkulator Margin Marketplace Indonesia",
      subtitle: "Lihat sisa margin setelah biaya marketplace, diskon, fulfilment, iklan, logistik, dan PPh 22.",
      badge: "FMCG by Alex • Alat komersial gratis",
      setup: "Pengaturan pesanan",
      marketplace: "Marketplace",
      units: "Unit per pesanan",
      price: "Harga jual per unit",
      discount: "Diskon ditanggung penjual",
      costs: "Biaya",
      cogs: "HPP per unit",
      platform: "Biaya marketplace",
      service: "Biaya layanan / admin",
      affiliate: "Biaya afiliator / creator",
      otherPercent: "Biaya persentase lainnya",
      fulfilment: "Fulfilment per pesanan",
      ads: "Iklan / akuisisi",
      shipping: "Subsidi ongkir penjual",
      otherFixed: "Biaya tetap lain",
      tax: "Perlakuan pajak",
      modelTax: "Modelkan pemungutan PPh 22",
      modelTaxHint: "Nonaktifkan hanya bila penjual / transaksi berada di luar pemungutan.",
      taxBase: "Peredaran bruto dasar pajak",
      treatment: "Cara memperlakukan 0,5%",
      final: "Biaya pajak final",
      credit: "Pemotongan dapat dikreditkan",
      results: "Hasil komersial",
      contribution: "Laba kontribusi",
      margin: "Margin kontribusi",
      settlement: "Estimasi kas settlement",
      withheld: "PPh 22 dipungut",
      breakeven: "Harga impas / unit",
      gross: "Nilai bruto pesanan",
      revenue: "Pendapatan bersih pelanggan",
      fees: "Biaya persentase marketplace",
      fixed: "Fulfilment + iklan + ongkir + tetap",
      cogsOut: "HPP",
      taxOut: "Dampak PPh 22",
      reset: "Reset contoh",
      export: "Ekspor CSV",
      healthy: "Ekonomi unit sehat",
      thin: "Margin tipis — awasi biaya promo",
      risk: "Margin berisiko",
      finalNote: "Perlakuan pajak final: 0,5% dimasukkan sebagai biaya ekonomi dalam laba kontribusi.",
      creditNote: "Perlakuan dapat dikreditkan: 0,5% mengurangi kas settlement, tetapi tidak dihitung sebagai biaya operasional SKU tambahan.",
      offNote: "Tidak ada pemungutan PPh 22 dalam model. Pastikan penjual atau transaksi memang berada di luar pemungutan.",
      foot: "Hanya alat perencanaan. Verifikasi struktur biaya marketplace dan perlakuan pajak aktual dengan penasihat yang berkualifikasi.",
      powered: "Teknologi oleh Sakura • Konteks komersial oleh FMCG by Alex"
    }
  };

  function rupiah(value) {
    return "Rp " + Math.round(Number.isFinite(value) ? value : 0).toLocaleString("id-ID");
  }

  function input() {
    const out = {};
    numericIds.forEach((id) => { out[id] = Number(byId(id).value || 0); });
    out.taxOn = byId("taxOn").checked;
    out.taxTreatment = byId("taxTreatment").value;
    return out;
  }

  function syncTaxBase() {
    if (document.activeElement === byId("taxBase")) return;
    byId("taxBase").value = Math.round(Number(byId("units").value || 0) * Number(byId("price").value || 0));
  }

  function render() {
    const result = core.calculate(input());
    byId("profit").textContent = rupiah(result.profit);
    byId("margin").textContent = result.margin.toFixed(1) + "%";
    byId("settlement").textContent = rupiah(result.settlement);
    byId("withheld").textContent = rupiah(result.tax);
    byId("breakeven").textContent = rupiah(result.breakEvenUnit);
    byId("gross").textContent = rupiah(result.gross);
    byId("revenue").textContent = rupiah(result.revenue);
    byId("fees").textContent = "− " + rupiah(result.variableFees);
    byId("fixed").textContent = "− " + rupiah(result.fixedCosts);
    byId("cogsOut").textContent = "− " + rupiah(result.cogs);
    byId("taxOut").textContent = "− " + rupiah(result.tax);
    const status = byId("status");
    status.textContent = result.margin >= 15 ? copy[language].healthy : result.margin >= 5 ? copy[language].thin : copy[language].risk;
    status.dataset.level = result.margin >= 15 ? "good" : result.margin >= 5 ? "warn" : "bad";
    byId("taxNote").textContent = !input().taxOn
      ? copy[language].offNote
      : input().taxTreatment === "credit"
        ? copy[language].creditNote
        : copy[language].finalNote;
  }

  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next === "id" ? "id" : "en";
    document.querySelectorAll("[data-copy]").forEach((node) => {
      const key = node.getAttribute("data-copy");
      if (key && copy[next][key]) node.textContent = copy[next][key];
    });
    byId("langEn").classList.toggle("active", next === "en");
    byId("langId").classList.toggle("active", next === "id");
    render();
  }

  function exportCsv() {
    const result = core.calculate(input());
    const rows = [
      ["Metric", "Value"],
      ["Marketplace", byId("marketplace").value],
      ["Gross order value", result.gross],
      ["Net customer revenue", result.revenue],
      ["Marketplace percentage fees", result.variableFees],
      ["Fixed operating costs", result.fixedCosts],
      ["COGS", result.cogs],
      ["PPh 22 withheld", result.tax],
      ["Estimated settlement cash", result.settlement],
      ["Contribution profit", result.profit],
      ["Contribution margin %", result.margin],
      ["Break-even price per unit", result.breakEvenUnit]
    ];
    const csv = rows.map((row) => row.map((value) => '"' + String(value).replace(/"/g, '""') + '"').join(",")).join("\n");
    if (window.FMCGAndroid && typeof window.FMCGAndroid.exportCsv === "function") {
      window.FMCGAndroid.exportCsv(csv);
      return;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "fmcg-by-alex-marketplace-margin-analysis.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  const defaults = {
    units: 1, price: 50000, discountPct: 5, cogs: 22000, platformFee: 6,
    serviceFee: 2, affiliateFee: 0, otherFeePct: 0, fulfilment: 2500,
    ads: 3500, shipping: 2000, otherFixed: 0, taxBase: 50000
  };

  function reset() {
    Object.keys(defaults).forEach((key) => { byId(key).value = defaults[key]; });
    byId("taxOn").checked = true;
    byId("taxTreatment").value = "final";
    byId("marketplace").selectedIndex = 0;
    render();
  }

  numericIds.forEach((id) => byId(id).addEventListener("input", () => {
    if (id === "units" || id === "price") syncTaxBase();
    render();
  }));
  ["taxOn", "taxTreatment", "marketplace"].forEach((id) => byId(id).addEventListener("change", render));
  byId("langEn").addEventListener("click", () => setLanguage("en"));
  byId("langId").addEventListener("click", () => setLanguage("id"));
  byId("reset").addEventListener("click", reset);
  byId("export").addEventListener("click", exportCsv);

  window.__FMCG_APP_SMOKE__ = function () {
    const sample = core.calculate({
      units: 1, price: 50000, discountPct: 5, cogs: 22000, platformFee: 6,
      serviceFee: 2, affiliateFee: 0, otherFeePct: 0, fulfilment: 2500,
      ads: 3500, shipping: 2000, otherFixed: 0, taxBase: 50000,
      taxOn: true, taxTreatment: "final"
    });
    return {
      ok: Number.isFinite(sample.profit) && Math.abs(sample.tax - 250) < 0.001 && document.querySelectorAll("input").length >= 10,
      title: document.title,
      profit: sample.profit,
      tax: sample.tax
    };
  };

  render();
})();
