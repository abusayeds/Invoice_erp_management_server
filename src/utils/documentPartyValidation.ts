import { Types } from "mongoose";
import { assertClientUser, assertVendorUser } from "./partyUser";

/** Validate optional client (customer_id) and vendor (vendor_id) on sales documents. */
export const validateDocumentParties = async (payload: {
  customer_id?: Types.ObjectId;
  vendor_id?: Types.ObjectId;
}) => {
  if (payload.customer_id) {
    await assertClientUser(payload.customer_id);
  }
  if (payload.vendor_id) {
    await assertVendorUser(payload.vendor_id);
  }
};
