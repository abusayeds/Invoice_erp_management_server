"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activities_interface_1 = require("./activities.interface");
const activitiesSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: Object.values(activities_interface_1.ActivitiesType),
        required: true,
    },
    isArchive: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const ActivitiesModel = (0, mongoose_1.model)("Activities", activitiesSchema);
exports.default = ActivitiesModel;
