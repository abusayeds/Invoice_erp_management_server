import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../errors/AppError";
import { CreditNoteModel } from "../creditNote/creditNote.model";
import { DebitNoteModel } from "../debitNote/debitNote.model";
import { creditNoteService } from "../creditNote/creditNote.service";
import { debitNoteService } from "../debitNote/debitNote.service";
import { InvoiceModel } from "../invoice/invoice.model";
import { BillModel } from "../bill/bill.model";
import { PurchaseOrderModel } from "../purchaseOrder/purchaseOrder.model";
import { TInvoiceReturn } from "../invoice/invoiceReturn/invoiceReturn.interface";
import { TReturnPurchase } from "../purchaseOrder/returnPurchase/returnPurchase.interface";
import { TCreditNote } from "../creditNote/creditNote.interface";
import { TDebitNote } from "../debitNote/debitNote.interface";

const buildNoteNumber = (prefix: string) => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${prefix}-${y}${m}${day}-${String(d.getTime()).slice(-4)}`;
};

/** Laravel: ApproveSalesReturn → CreateCreditNoteFromReturn (draft credit note). */
export const createCreditNoteFromInvoiceReturn = async (
  userId: string,
  salesReturn: TInvoiceReturn & { _id: Types.ObjectId }
) => {
  const existing = await CreditNoteModel.findOne({
    user_id: userId,
    return_id: salesReturn._id,
    isDeleted: false,
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Credit note already exists for this sales return");
  }

  const invoice = await InvoiceModel.findOne({
    _id: salesReturn.invoice_id,
    user_id: userId,
    isDeleted: false,
  });
  if (!invoice) {
    throw new AppError(httpStatus.NOT_FOUND, "Original invoice not found for this return");
  }
  if (!invoice.customer_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invoice has no customer; cannot create credit note");
  }

  const payload: Partial<TCreditNote> = {
    user_id: new Types.ObjectId(userId),
    customer_id: invoice.customer_id,
    source: "return",
    return_id: salesReturn._id,
    source_invoice_id: invoice._id,
    return_reason: salesReturn.return_reason,
    invoice_number: buildNoteNumber("CN"),
    currency: invoice.currency,
    date: salesReturn.return_date ?? new Date(),
    product: invoice.product ? [...invoice.product] : undefined,
    service: invoice.service ? [...invoice.service] : undefined,
    billing_address: invoice.billing_address,
    shipping_address: invoice.shipping_address,
    sub_total: invoice.sub_total,
    discount: invoice.discount,
    shipping_cost: invoice.shipping_cost,
    inline_discount: invoice.inline_discount,
    tax: invoice.tax,
    total: invoice.total,
    status: "Draft",
    notes: salesReturn.notes,
    internal_notes: `Auto-created from sales return: ${salesReturn.return_reason}`,
    applied_amount: 0,
    balance_amount: invoice.total ?? 0,
  };

  return creditNoteService.createDB(payload as TCreditNote);
};

/** Laravel: ApprovePurchaseReturn → CreateDebitNoteFromReturn (draft debit note). */
export const createDebitNoteFromPurchaseReturn = async (
  userId: string,
  purchaseReturn: TReturnPurchase & { _id: Types.ObjectId }
) => {
  const existing = await DebitNoteModel.findOne({
    user_id: userId,
    return_id: purchaseReturn._id,
    isDeleted: false,
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Debit note already exists for this purchase return");
  }

  const sourceId = purchaseReturn.purchase_order_id;
  let doc =
    (await BillModel.findOne({ _id: sourceId, user_id: userId, isDeleted: false })) ??
    (await PurchaseOrderModel.findOne({ _id: sourceId, user_id: userId, isDeleted: false }));

  if (!doc) {
    throw new AppError(httpStatus.NOT_FOUND, "Original purchase bill/order not found");
  }

  const vendor_id = doc.vendor_id;
  if (!vendor_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Purchase document has no vendor; cannot create debit note");
  }

  const payload: Partial<TDebitNote> = {
    user_id: new Types.ObjectId(userId),
    vendor_id,
    source: "return",
    return_id: purchaseReturn._id,
    source_invoice_id: doc._id,
    return_reason: purchaseReturn.return_reason,
    invoice_number: buildNoteNumber("DN"),
    currency: doc.currency,
    date: purchaseReturn.return_date ?? new Date(),
    product: doc.product ? [...doc.product] : undefined,
    service: doc.service ? [...doc.service] : undefined,
    billing_address: doc.billing_address,
    shipping_address: doc.shipping_address,
    sub_total: doc.sub_total,
    discount: doc.discount,
    shipping_cost: doc.shipping_cost,
    inline_discount: doc.inline_discount,
    tax: doc.tax,
    total: doc.total,
    status: "Draft",
    notes: purchaseReturn.notes,
    internal_notes: `Auto-created from purchase return: ${purchaseReturn.return_reason}`,
    applied_amount: 0,
    balance_amount: doc.total ?? 0,
  };

  return debitNoteService.createDB(payload as TDebitNote);
};
