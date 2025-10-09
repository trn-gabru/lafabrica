import mongoose from "mongoose"

const FeatureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  order: {
    type: Number,
    default: 0,
  },
})

const PortfolioItemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    hero_heading: {
      type: String,
      required: true,
    },
    hero_subheading: {
      type: String,
      required: true,
    },
    introduction: {
      type: String,
      required: true,
    },
    why_choose: {
      type: String,
      required: true,
    },
    cta: {
      type: String,
      required: true,
    },
    features: [FeatureSchema],
    images: [ImageSchema],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.PortfolioItem || mongoose.model("PortfolioItem", PortfolioItemSchema)
