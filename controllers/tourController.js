/* eslint-disable prettier/prettier */
const TourModel = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,duration,price,ratingsAverage,summary";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Executing Query
  const features = new APIFeatures(TourModel.find(), req.query);
  features.filter().sort().limitFields().paginate();
  const tours = await features.query;

  //sending response
  res.status(200).json({
    status: "sucessfull",
    length: tours.length,
    data: {
      tours,
    },
  });
});

exports.getSingleTourByID = catchAsync(async (req, res, next) => {
  const selectedTour = await TourModel.findById(req.params.id).populate(
    "reviews"
  );
  if (!selectedTour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    tourid: req.params.id,
    data: selectedTour,
  });
});

exports.postNewTour = catchAsync(async (req, res, next) => {
  const newTour = await TourModel.create(req.body);
  res.status(201).json({
    status: "Sucessful",
    data: newTour,
  });
});

exports.patchTourByID = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "sucess",
    data: {
      tour,
    },
  });
});

exports.deleteTourByID = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findByIdAndDelete(req.params.id);
  res.status(202).json({ status: "Successful", tour });
});

exports.getAllToursStats = catchAsync(async (req, res, next) => {
  const stats = await TourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "sucess",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const planTour = await TourModel.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      }, // Filter by dates within the specified year
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "sucess",
    data: {
      planTour,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng",
        400
      )
    );
  }
  const tours = await TourModel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "sucess",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng",
        400
      )
    );
  }
  const distances = await TourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
        price: 1,
      },
    },
    {
      $sort: {
        distance: 1,
        price: 1,
      },
    },
  ]);
  res.status(201).json({
    status: "sucess",
    results: distances,
  });
});
