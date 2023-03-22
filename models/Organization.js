const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  organizationLocation: {
    type: String,
    required: true,
  },
  organizationEmail: {
    type: String,
  },
  organizationWebsite: {
    type: String,
  }
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;