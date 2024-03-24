/* eslint-disable prettier/prettier */
const TourModel = require("../models/tourModel");

const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,duration,price,ratingsAverage,summary";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
      error: err,
    });
  }
};

exports.getSingleTourByID = async (req, res) => {
  try {
    const selectedTour = await TourModel.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      tourid: req.params.id,
      data: selectedTour,
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.postNewTour = async (req, res) => {
  try {
    const newTour = await TourModel.create(req.body);
    res.status(201).json({
      status: "Sucessful",
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.patchTourByID = async (req, res) => {
  try {
    const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      status: "sucess",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.deleteTourByID = async (req, res) => {
  try {
    const tour = await TourModel.findByIdAndDelete(req.params.id);
    res.status(202).json({ status: "Successful", tour });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.getAllToursStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    //console.log(err);
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};
