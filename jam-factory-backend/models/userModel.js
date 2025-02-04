// Importing required libraries
const mongoose = require("mongoose"); // Mongoose for MongoDB interaction
const validator = require("validator"); // Validator for validating email
const brcypt = require("bcryptjs"); // Bcrypt for hashing passwords

// Defining the user schema for MongoDB
const userSchema = new mongoose.Schema({
  // User's name - Required field
  name: {
    type: String,
    require: [true, "Please insert name"], // Validation: name is required
  },

  // User's email - Required field, must be unique and a valid email
  email: {
    type: String,
    require: [true, "Please insert your email"], // Validation: email is required
    unique: true, // Ensure the email is unique in the database
    lowercase: true, // Convert email to lowercase automatically
    validate: [validator.isEmail, "is not email"], // Validate that the email is a valid format
  },

  // User's photo - Optional field for the user's profile picture
  photo: {
    type: String,
  },

  // User's password - Required field with a minimum length of 8
  password: {
    type: String,
    require: [true, "Please insert your password"], // Validation: password is required
    minlength: 8, // Minimum length of 8 characters
    select: false, // Exclude password from queries by default
  },

  // Password confirmation - Required field, must match the original password
  passwordConfirm: {
    type: String,
    require: [true, "Please confirm your password"], // Validation: password confirmation is required
    minlength: 8, // Minimum length of 8 characters
    validate: {
      // Custom validation to check if passwordConfirm matches password
      validator: function (el) {
        return el == this.password; // `this.password` refers to the original password field
      },
      message: "Passwords are not the same", // Error message if passwords don't match
    },
  },

  // Timestamp of when the password was changed (if applicable)
  passwordChangedAt: Date,

  // Password reset token for password recovery
  passwordResetToken: String,

  // Expiry date for the password reset token
  passwordResetExpires: Date,

  // User account status - whether the account is active or not (default is true)
  active: {
    type: Boolean,
    default: true, // Account is active by default
    select: false, // Exclude the 'active' field from queries by default
  },
});

// Middleware that runs before saving the user document to the database
userSchema.pre("save", async function (next) {
  // If the password hasn't been modified, don't hash it again
  if (!this.isModified("password")) {
    return next(); // Skip the middleware and move to the next step
  }

  // Hash the password with a cost factor of 12
  this.password = await brcypt.hash(this.password, 12);

  // Don't need to store the password confirmation after hashing the password
  this.passwordConfirm = undefined;

  // Move on to the next middleware (save the document)
  next();
});

// Method to compare a candidate password (from login form) with the stored password
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  // Compare the candidate password with the stored hashed password using bcrypt
  return await brcypt.compare(candidatePassword, userPassword);
};

// Method to check if the password was changed after a given JWT timestamp
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  // If the passwordChangedAt field exists, compare timestamps
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt to a UNIX timestamp (in seconds)
    const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000.1);

    // If JWT timestamp is less than the password change timestamp, return true
    return JWTTimestamp < changeTimestamp;
  }
};

// Create the User model using the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
