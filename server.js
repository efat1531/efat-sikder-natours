/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const db = process.env.DATABASE_Local;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB has been connected sucessfully!"))
  .catch((er) => console.log(`Error connecting MongoDB: ${er}`));

const app = require("./app");

const port = process.env.PORT || 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server live at http://127.0.0.1:${port}`);
});
