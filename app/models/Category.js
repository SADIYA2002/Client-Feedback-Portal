import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    color: { type: String, default: "bg-slate-100 text-slate-700" },
    icon: { type: String, default: "tag" },
    sortOrder: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

categorySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
