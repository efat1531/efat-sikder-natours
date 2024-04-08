/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TourModel = require("../../models/tourModel");

dotenv.config({ path: "./.env" });
const db = process.env.DATABASE_Local;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB has been connected sucessfully!"))
  .catch((er) => console.log(`Error connecting MongoDB: ${er}`));

// Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

const importData = async () => {
  try {
    await TourModel.create(tours);
    console.log("Data Sucessfully Loaded.");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection
const deleteData = async () => {
  try {
    await TourModel.deleteMany();
    console.log("Data Sucessfully Deleted!!!!!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
