import { Types } from "mongoose";
import { UserModel } from "../../../basic_modules/user/user.model";
import { role } from "../../../../utils/role";

// eslint-disable-next-line no-unused-vars
type Counter = (companyId: Types.ObjectId) => Promise<number>;

/** Every kind of company user counts toward the single plan cap (number_of_users). */
const COUNTED_ROLES = [role.staff, role.hr, role.customer, role.vendor, "client"];


export const LIMIT_COUNTERS: Record<string, Counter> = {
  users: (companyId) =>
    UserModel.countDocuments({
      companyId,
      isDeleted: false,
      role: { $in: COUNTED_ROLES },
    }),
};
