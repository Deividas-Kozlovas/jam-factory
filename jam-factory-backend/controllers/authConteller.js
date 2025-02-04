// Import the required modules
const User = require("../models/userModel"); // Import the User model to interact with the MongoDB database
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library to generate a JWT token
const { promisify } = require("util"); // Import promisify from the 'util' module for working with async functions

exports.singup = async (req, res) => {
  try {
    // Create a new user in the database using the data from the request body
    const newUser = await User.create({
      name: req.body.name, // Get the name from the request body
      email: req.body.email, // Get the email from the request body
      password: req.body.password, // Get the password from the request body
      passwordConfirm: req.body.passwordConfirm, // Get the password confirmation from the request body
    });

    // Generate a JWT token for the new user, using the user's _id as payload
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration time, defined in your environment variables
    });

    // Send a response with a success status, the created user, and the generated token
    res.status(201).json({
      status: "Success", // Indicating the operation was successful
      data: newUser, // The new user object that was created
      token, // The JWT token for authenticating the user in future requests
    });
  } catch (err) {
    // If an error occurs (e.g., validation error or database error), send a failure response
    res.status(400).json({
      status: "Failed", // Indicating the operation failed
      message: err.message, // Sending the error message as a response
    });
  }
};
