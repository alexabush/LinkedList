const mongoose = require("mongoose");

mongoose.Promise = Promise;
mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/linkedList")
  .then(() => {
    console.log("successfully connected to database");
  })
  .catch(err => {
    console.log(err);
  });

const PORT = process.env.PORT || 3000;
const app = require("./app");
app.get("/", (req, res, next) => {
  return res.send("DEPLOYED");
});
app.listen(PORT, () => {
  console.log(`jobs API is listening on port ${PORT}`);
});
