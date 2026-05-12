import mongoose, { Schema } from "mongoose";
import { TPermission } from "./permission.interface";
import { role } from "../../../utils/role";

const permissionSchema = new Schema<TPermission>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(role),
      required: true,
    },
    permissions: [{ type: String }],
  },
  { timestamps: true },
);
permissionSchema.index({ companyId: 1, role: 1 }, { unique: true });

export const PermissionModel = mongoose.model<TPermission>(
  "Permission",
  permissionSchema,
);
