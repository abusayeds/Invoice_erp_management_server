import mongoose, { Schema } from "mongoose";
import { ACCESS_LEVELS, ITeamMember, MODULE_NAMES, SHARING_TYPES } from "./teamMember.interface";

const PermissionSchema = new Schema(
  {
     module: {
      type: String,
      enum: MODULE_NAMES, 
      required: true,
    },
    sharing: {
      type: String,
      enum: SHARING_TYPES,
      default: "All Data",
    },
    access: {
      type: String,
      enum: ACCESS_LEVELS,
      default: "No Access",
    },
  },
  { _id: false }
);

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "accepted",
    },
    permissions: [PermissionSchema],
    dashboard: { type: Boolean, default: true },
    reports: { type: Boolean, default: true },
    import: { type: Boolean, default: true },
    export: { type: Boolean, default: true },
    titles: { type: Boolean, default: true },
    settings: { type: Boolean, default: true },
    eInvoicing: { type: Boolean, default: true },
    eWayBill: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TeamMemberModel = mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
