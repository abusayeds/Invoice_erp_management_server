"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseService = void 0;
const user_model_1 = require("../../basic_modules/user/user.model");
const purchase_model_1 = require("./purchase.model");
const purchaseSubscriptionDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findExtingPurchase = yield purchase_model_1.PurchaseModel.findOne({
        user_id: payload.user_id,
    });
    if (findExtingPurchase) {
        yield purchase_model_1.PurchaseModel.findOneAndUpdate({ user_id: payload.user_id }, payload, { new: true });
    }
    else {
        const res = yield purchase_model_1.PurchaseModel.create(payload);
        yield user_model_1.UserModel.findByIdAndUpdate(payload.user_id, { subscriptionId: res._id }, { new: true });
    }
});
exports.purchaseService = {
    purchaseSubscriptionDB,
};
