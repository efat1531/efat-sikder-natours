/* eslint-disable import/no-extraneous-dependencies */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const bookingModel = require("../models/bookingModel");
const TourModel = require("../models/tourModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await TourModel.findById(req.params.tourId);

  //   create accept and cancel url
  const acceptUrl = `${req.protocol}://${req.get("host")}?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`;
  const cancelUrl = `${req.protocol}://${req.get("host")}/tour/${tour.slug}`;

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            // images: [
            //   `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
            // ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${acceptUrl}`,
    cancel_url: `${cancelUrl}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
  });

  // 3) Create session as response
  try {
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    throw new AppError(err.message, 500);
  }
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();
  await bookingModel.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});
