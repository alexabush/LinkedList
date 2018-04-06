const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: "Required Value" },
    email: { type: String, required: "Required Value" },
    handle: { type: String, required: "Required Value" },
    password: { type: String, required: "Required Value" },
    logo: String,
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ]
  },
  { timestamp: true }
);

companySchema.statics = {
  deleteCompany(handle) {
    return this.findOneAndRemove({ handle: handle })
      .then(company => {
        return mongoose
          .model("Job")
          .remove({ company: company.id })
          .then(() => {
            console.log("Jobs removed");
            return mongoose
              .model("User")
              .update(
                { currentCompanyId: company.id },
                { $set: { currentCompanyId: null } },
                { multi: true }
              )
              .then(() => {
                console.log("Company id removed from users");
              })
              .catch(err => Promise.reject(err));
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};
const Company = mongoose.model("Company", companySchema);

module.exports = Company;
