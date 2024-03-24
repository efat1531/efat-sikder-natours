const fs = require("fs");

const dir = `${__dirname}/../dev-data/data/users.json`;

const users = JSON.parse(fs.readFileSync(dir));

exports.getAllUser = (req, res) => {
  res
    .status(501)
    .json({ status: "Error", message: "This route not implimented yet" });
};

exports.getSingleUserByID = (req, res) => {
  res
    .status(501)
    .json({ status: "Error", message: "This route not implimented yet" });
};

exports.postNewUser = (req, res) => {
  res
    .status(501)
    .json({ status: "Error", message: "This route not implimented yet" });
};

exports.patchTUserByID = (req, res) => {
  res
    .status(501)
    .json({ status: "Error", message: "This route not implimented yet" });
};

exports.deleteUserByID = (req, res) => {
  res
    .status(501)
    .json({ status: "Error", message: "This route not implimented yet" });
};
