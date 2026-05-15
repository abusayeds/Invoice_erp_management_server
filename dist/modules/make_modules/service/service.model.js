"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = void 0;
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    serviceName: { type: String, required: true, trim: true },
    unitType: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    rate: { type: Number, required: true },
    taxes: [{ type: String }],
    currency: {
        type: String,
        enum: ["USD", "BDT", "EUR", "INR"],
        default: "BDT",
    },
    description: { type: String },
    serviceStock: { type: Boolean, default: false },
    sac: { type: Boolean, default: false },
    productStock: { type: Boolean, default: false },
    hsn: { type: Boolean, default: false },
    isArchive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.ServiceModel = (0, mongoose_1.model)("Service", serviceSchema);
