"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTitleModel = void 0;
const mongoose_1 = require("mongoose");
const seedEditSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    titles: [
        {
            name: { type: String, required: true },
        },
    ],
}, {
    timestamps: true,
});
exports.EditTitleModel = (0, mongoose_1.model)("EditTitle", seedEditSchema);
