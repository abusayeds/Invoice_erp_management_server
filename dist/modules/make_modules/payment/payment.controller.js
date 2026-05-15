"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../../config");
const purchase_service_1 = require("../purchasePlan/purchase.service");
exports.stripe = new stripe_1.default(config_1.STRIPE_SECRET_KEY);
const paymentCheckoutSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield exports.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: payload.price * 100,
                    product_data: {
                        name: "Purchase subscription",
                    }
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: payload === null || payload === void 0 ? void 0 : payload.successUrl,
        cancel_url: payload === null || payload === void 0 ? void 0 : payload.cancelUrl,
        metadata: {
            planData: JSON.stringify(payload) || null,
        },
    });
    return { url: session.url, sessionId: session.id };
});
const webhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sig = req.headers["stripe-signature"];
    try {
        const webhookSecret = config_1.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("Webhook Secret Key Missing!");
            return res.status(500).send("Server configuration error");
        }
        const event = exports.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        const session = event.data.object;
        const planData = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.planData;
        if (event.type === "checkout.session.completed") {
            if (session.payment_status !== 'paid') {
                console.log('Payment not completed, status:', session.payment_status);
                return res.json({ received: true });
            }
            if (!planData) {
                console.error('planData not found in metadata');
                return res.json({ received: true });
            }
            if (session.payment_status === 'paid') {
                yield purchase_service_1.purchaseService.purchaseSubscriptionDB(JSON.parse(planData));
                console.log("in webhook", planData);
            }
        }
        else if (event.type === "checkout.session.async_payment_failed") {
            const sessionId = session.id;
            console.log(`Payment failed for session: ${sessionId}`);
        }
        else if (event.type === "transfer.created") {
            console.log("transfer.created", session.metadata);
            return res.json({ received: true });
        }
        else {
            console.log(`⚠️ Unhandled event type: ${event.type}`);
        }
        return res.json({ received: true });
    }
    catch (err) {
        console.error(`❌ Webhook error: ${err.message}`);
        if (err.type === 'StripeSignatureVerificationError') {
            return res.status(400).send(`Invalid signature: ${err.message}`);
        }
        return res.status(200).json({
            received: true,
            error: 'Processing error, will handle manually'
        });
    }
});
exports.paymentController = {
    webhook,
    paymentCheckoutSession,
};
