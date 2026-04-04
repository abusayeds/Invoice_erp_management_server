import { UserModel } from "../../basic_modules/user/user.model";
import { TPurchase } from "./purchase.interface";
import { PurchaseModel } from "./purchase.model";

const purchaseSubscriptionDB = async (payload: TPurchase) => {
  const findExtingPurchase = await PurchaseModel.findOne({
    user_id: payload.user_id,
  });
  if (findExtingPurchase) {
    await PurchaseModel.findOneAndUpdate(
      { user_id: payload.user_id },
      payload,
      { new: true },
    );
  } else {
     const res  =  await PurchaseModel.create(payload);
     await UserModel.findByIdAndUpdate(payload.user_id, { subscriptionId: res._id }, { new: true })
  }
};

export const purchaseService = {
  purchaseSubscriptionDB,
};
