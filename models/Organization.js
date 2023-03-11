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
});

const joiAttendanceSchema = Joi.object({
  organizationName: Joi.string().required(),
  organizationLocation: Joi.string().required(),
  organizationEmail: Joi.string(),
});
  
  // Define a validate function to validate organization data using Joi schema
  function validateOrganization(organization) {
    return joiAttendanceSchema.validate(organization);
  }
  
  const Organization = mongoose.model("Organization", organizationSchema);
  
  module.exports = {
    Organization,
    validateOrganization
  };