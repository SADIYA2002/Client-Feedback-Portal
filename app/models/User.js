import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["Client", "Product Team"], default: "Client" },
    tier: { type: String, default: "Enterprise Tier" },
    badgeColor: { type: String, default: "bg-blue-600 text-white" },
    avatarBg: { type: String, default: "bg-blue-100 text-blue-700" },
    avatar: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.userId || ret._id.toString();
    return ret;
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;