/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
const slugify = require("slugify");

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name!"],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, "A tour must have a duration!"],
    },
    maxGroupSize: {
      type: Number,
      default: 8,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty level!"],
      trim: true,
      enum: {
        values: ["easy", "medium", "difficult", "hard"],
        message: "Difficulty is easy, medium, difficult, hard",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 5.0,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "A tour must have some price!"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be less than actual price",
      },
      default: 0,
    },

    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have summary!"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, "Tour must have a image cover!"],
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
        required: [true, "A tour must have a start location!"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    leadGuide: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    images: [String],
    startDates: [Date],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: "2dsphere" });

toursSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -_id",
  });
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: "leadGuide",
    select: "-__v -passwordChangedAt -_id",
  });
  next();
});

toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const TourModel = mongoose.model("Tour", toursSchema);

module.exports = TourModel;
