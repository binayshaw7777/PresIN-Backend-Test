const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Minimum password length is 6 characters"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: [true, "Please enter a role"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  embeddingsData: {
    type: String,
    required: true,
  },
});

const joiUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  isAdmin: Joi.boolean().default(false),
  role: Joi.string().required(),
  createdAt: Joi.date().default(Date.now()),
  embeddingsData: Joi.string().required(),
});

// Define a validate function to validate user data using Joi schema
function validateUser(user) {
    return joiUserSchema.validate(user);
}

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    validateUser
};