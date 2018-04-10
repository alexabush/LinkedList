const mongoose = require("mongoose");

mongoose.Promise = Promise;
mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost/linkedList")
  .then(() => {
    console.log("successfully connected to database");
  })
  .catch(err => {
    console.log(err);
  });

const PORT = 3000;
const app = require("./app");
app.listen(PORT, () => {
  console.log(`jobs API is listening on port ${PORT}`);
});
