/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const db =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_ONLINE
    : process.env.DATABASE_ONLINE;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB has been connected sucessfully!"))
  .catch((er) => console.log(`Error connecting MongoDB: ${er}`));

const app = require("./app");

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server live at http://localhost:${port} in ${process.env.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
