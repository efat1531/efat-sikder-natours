const reviewModel = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

module.exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filters = {};
  if (req.params.tourId) filters = { tour: req.params.tourId };
  const reviews = await reviewModel.find(filters);
  res.status(200).json({
    status: "success",
    length: reviews.length,
    data: {
      reviews,
    },
  });
});

module.exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await reviewModel.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.params.tourId,
    user: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

module.exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await reviewModel.findById(req.params.id);
  // check if review is mine or not

  if (review.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "You are not allowed to delete this review",
    });
  }

  if (!review)
    return res.status(404).json({
      status: "error",
      message: "No review found with that ID",
    });

  await reviewModel.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports.updateReview = catchAsync(async (req, res, next) => {
  // Check if review is mine or not
  const review = await reviewModel.findById(req.params.id);
  if (review.user._id.toString() !== req.user.id) {
    return res.status(403).json({
      status: "error",
      message: "You are not allowed to update this review",
    });
  }
  const updatedReview = await reviewModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      review: updatedReview,
    },
  });
});
