import { dayOptions } from "@/options/projectOptions";
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    paymentType: {
      type: String,
      enum: ["Incoming", "Outgoing"],
    },
    issuedDate: { type: Date },
    recordAddedDate: { type: Date },
    prePaymentTitle: { type: String },
    prePaymentDescription: { type: String },
    paymentPurpose: { type: String },
    otherPaymentPurpose: { type: Boolean, default: false },
    // for incoming
    // schools => projectname,id / organizers / workshops/ sales/ student fee => studentname,id
    paymentSource: { type: String }, // Hca for outgoing else select
    otherPaymentSource: { type: Boolean, default: false },
    paymentSourceInfo: {
      type: { 
        senderName: { type: String },
        phone: { type: Number },
        email: { type: String },
        bankName: { type: String },
        bankAccountNumber: { type: String },
        ewalletName: { type: String },
        ewalletNumber: { type: String },
      },
    },
    projectName: { type: String },
    projectId: { type: mongoose.Schema.Types.Mixed, ref: "Project" },
    studentName: { type: String },
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "HcaAffiliatedStudent",
    },

    // outgoing
    recipient: {
      userName: { type: String },
      userId: {
        type: mongoose.Schema.Types.Mixed,
        ref: "User",
      },
      name: { type: String },
      phone: { type: Number },
      email: { type: String },
      bankName: { type: String },
      bankAccountNumber: { type: String },
      ewalletName: { type: String },
      ewalletNumber: { type: String },
    },

    totalAmount: { type: Number },
    totalPaid: { type: Number },
    remainingAmount: { type: Number },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },
    installments: {
      type: [
        {
          amount: { type: Number, required: true },
          paidDate: { type: Date, default: Date.now },
          paymentMethod: { type: String, enum: ["Cash", "Online", "Bank"] },
          paymentTitle: { type: String },
          paymentTime: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    paymentFiles: {
      type: [
        {
          fileName: { type: String, required: true },
          fileUrl: { type: String, required: true },
          fileType: { type: String },
          uploadedAt: { type: Date, default: Date.now },
          uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      default: [],
    },
    updatedBy: {
      type: [Object], // This means "array of any kind of object"
      default: [],
    },
    createdBy: { type: Object },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
