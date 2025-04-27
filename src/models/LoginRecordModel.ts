import mongoose from "mongoose";

// Define the LoginRecord schema
const LoginRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
    },
    branchName: {
      type: String,
    },
    branchId: {
      type: String,
    },
    isGlobalAdmin: {
      type: Boolean,
      default: false,
    },
    // A private IP address is an IP address used within a local network, such as the network inside your home or office. These addresses are not visible or routable on the internet, meaning that they are only used for communication within your private network.
    privateIpAddress: {
      type: String,
    },
    // public IP address (also known as the external IP or public-facing IP) is typically the IP address assigned to your router or gateway device by your Internet Service Provider (ISP). This IP address is used when packets are sent from your home network to the wider internet.
    publicIpAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timeZone: {
      type: String,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    ispOrg: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Define the LoginRecord model
const LoginRecord =
  mongoose.models.LoginRecord ||
  mongoose.model("LoginRecord", LoginRecordSchema);

export default LoginRecord;
