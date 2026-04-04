
import { TPurchase } from "../purchasePlan/purchase.interface";
import { paymentController } from "./payment.controller";


const payment = async (payload: TPurchase) => {
    const result = await paymentController.paymentCheckoutSession(payload);
    return result;
};

export const paymentService = {
    payment,
}