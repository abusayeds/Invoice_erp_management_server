"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const category_interface_1 = require("./category.interface");
const categorySchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    type: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    parentCategory: {
        type: String,
        enum: ["No Parent Category", ...Object.values(category_interface_1.parentCategoryEnum)],
        default: "No Parent Category",
    },
}, {
    timestamps: true,
});
exports.CategoryModel = (0, mongoose_1.model)("Category", categorySchema);
