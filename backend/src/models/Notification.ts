import mongoose, { Model, Schema, Document } from "mongoose";
import { INotification } from "../interfaces/notification.interface";
import { NotificationsEnums } from "../types/notification";
export interface INotificationDocument extends INotification, Document {}
const NotificationSchema: Schema<INotificationDocument> = new Schema<INotificationDocument>(
  {
     title:{
        type: String,
        required: true,
     },

     description:{
        type: String,
        required: true,
     },
     noti_type:{
       type : String,
        enum: NotificationsEnums,
        required: true,
     },
     creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
     }
  },
  {
    timestamps: true,
  }
);
const NotificationModel: Model<INotificationDocument> = mongoose.model<INotificationDocument>(
  "Notification",
  NotificationSchema
);
export default NotificationModel;
