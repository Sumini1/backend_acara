import mongoose, { Schema, Types, Document } from "mongoose";
import * as Yup from "yup";

// Validation schema
export const eventValidationSchema = Yup.object({
  name: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
  description: Yup.string().required(),
  banner: Yup.string().required(),
  isFeatured: Yup.boolean().default(false),
  isOnline: Yup.boolean().default(false),
  isPublish: Yup.boolean().default(false),
  category: Yup.string().required(),
  slug: Yup.string(),
  createdBy: Yup.string(),
  location: Yup.object({
    region: Yup.number(),
    coordinates: Yup.array().of(Yup.number()).length(2).default([0, 0]),
  }).when("isOnline", {
    is: false,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
});

// Event interface
export interface IEvent extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  banner: string;
  isFeatured: boolean;
  isOnline: boolean;
  isPublish: boolean;
  category: Types.ObjectId;
  slug: string;
  createdBy: Types.ObjectId;
  location?: {
    region?: number;
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Event Schema
const EventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    banner: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isPublish: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    slug: { type: String, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
    location: {
      region: { type: Number },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

// Custom validation for location
EventSchema.pre("validate", function (next) {
  if (!this.isOnline && (!this.location || !this.location.coordinates)) {
    next(new Error("Location is required if event is offline."));
  } else {
    next();
  }
});

// Auto generate slug before saving
EventSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }
  next();
});

const EventModel = mongoose.model<IEvent>("Event", EventSchema);
export default EventModel;
