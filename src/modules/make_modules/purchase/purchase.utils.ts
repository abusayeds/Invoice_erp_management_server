import { Model, Types } from "mongoose";

export const round2 = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

export type RawItem = {
  product_id: Types.ObjectId | string;
  quantity?: number;
  return_quantity?: number;
  unit_price: number;
  discount_percentage?: number;
  tax_percentage?: number;
  taxes?: { tax_name: string; tax_rate: number }[];
  [key: string]: unknown;
};

export type ComputedTotals = {
  items: Array<RawItem & {
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
  }>;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
};

/**
 * Mirrors Laravel calculateTotals/calculateReturnTotals:
 *   line   = qty * unit_price
 *   disc   = line * discount_percentage / 100
 *   tax    = (line - disc) * tax_percentage / 100
 *   total  = line - disc + tax
 * `qtyField` is "quantity" for invoices, "return_quantity" for returns.
 */
export const computeTotals = (items: RawItem[], qtyField: "quantity" | "return_quantity" = "quantity"): ComputedTotals => {
  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  const computed = (items || []).map((it) => {
    const qty = Number(it[qtyField] ?? it.quantity ?? 0);
    const unit = Number(it.unit_price ?? 0);
    const line = qty * unit;
    const discPct = Number(it.discount_percentage ?? 0);
    const discountAmount = (line * discPct) / 100;
    const afterDiscount = line - discountAmount;
    const taxPct = Number(it.tax_percentage ?? 0);
    const taxAmount = (afterDiscount * taxPct) / 100;

    subtotal += line;
    totalDiscount += discountAmount;
    totalTax += taxAmount;

    return {
      ...it,
      discount_amount: round2(discountAmount),
      tax_amount: round2(taxAmount),
      total_amount: round2(afterDiscount + taxAmount),
    };
  });

  return {
    items: computed,
    subtotal: round2(subtotal),
    tax_amount: round2(totalTax),
    discount_amount: round2(totalDiscount),
    total_amount: round2(subtotal + totalTax - totalDiscount),
  };
};

/**
 * Sequential per-company document number, e.g. PI-2026-06-001 / PR-2026-06-001.
 * Mirrors Laravel PurchaseInvoice::generateInvoiceNumber (scoped to created_by -> user_id).
 */
export const generateDocNumber = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  userId: string | Types.ObjectId,
  prefix: string,
  field: string
): Promise<string> => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const base = `${prefix}-${year}-${month}-`;
  const last = await model
    .findOne({ user_id: userId, [field]: { $regex: `^${base}` } })
    .sort({ [field]: -1 })
    .lean();

  let next = 1;
  if (last && (last as Record<string, unknown>)[field]) {
    const lastNo = parseInt(String((last as Record<string, unknown>)[field]).slice(-3), 10);
    if (!Number.isNaN(lastNo)) next = lastNo + 1;
  }
  return base + String(next).padStart(3, "0");
};
