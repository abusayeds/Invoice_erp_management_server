export const calculateInvoice = async (data: any) => {
  let sub_total = 0;
  let inline_discount = 0;
  let tax_total = 0;

  const processItems = (items?: any[]) => {
    if (!Array.isArray(items) || items.length === 0) return;

    for (const item of items) {
      const quantity = Number(item?.quantity) || 0;
      const rate = Number(item?.rate) || 0;
      const discountPercent = Number(item?.discount) || 0;
      const taxPercent = Number(item?.tax) || 0;

      const base = quantity * rate;

      const discountAmount = (base * discountPercent) / 100;
      const afterDiscount = base - discountAmount;

      const taxAmount = (afterDiscount * taxPercent) / 100;

      inline_discount += discountAmount;
      tax_total += taxAmount;

      // ❌ sub_total e tax add hobe na
      sub_total += afterDiscount;
    }
  };

  // 👉 handle all cases
  processItems(data?.product);
  processItems(data?.service);

  // 👉 global discount (%)
  const discountPercent = Number(data?.discount) || 0;
  const discountAmount = (sub_total * discountPercent) / 100;

  const shipping_cost = Number(data?.shipping_cost) || 0;
  const deposit = Number(data?.deposit) || 0;

  // ✅ total e tax add hobe
  const total =
    sub_total +
    tax_total -
    discountAmount +
    shipping_cost -
    deposit;

  return {
    sub_total: Number(sub_total.toFixed(2)),
    deposit,
    discount: discountPercent,
    shipping_cost,
    inline_discount: Number(inline_discount.toFixed(2)),
    tax: Number(tax_total.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};