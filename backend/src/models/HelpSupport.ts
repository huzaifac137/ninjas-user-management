import mongoose, { Model, Schema, Document } from "mongoose";
import { IOtpReset } from "../interfaces/index";
import { IHelpSupport } from "../interfaces/helpSupport";
export interface IHelpSupportDocument extends IHelpSupport, Document {}
const otpResetSchema: Schema<IHelpSupportDocument> = new Schema<IHelpSupportDocument>(
  {
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
  },
  {
    timestamps: true,
  }
);
const HelpSupport: Model<IHelpSupportDocument> = mongoose.model<IHelpSupportDocument>(
  "help-support",
  otpResetSchema
);
export default HelpSupport;
