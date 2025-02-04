const User = require("../models/userModel"); // Import the User model to access the user data in the database
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library to verify the JWT token
const { promisify } = require("util"); // Promisify function to work with async/await in jwt.verify()

// Middleware function to authenticate the user
exports.authUser = async (req, res, next) => {
  // Initialize token variable to store the JWT token
  let token;

  try {
    // Check if the authorization header exists and starts with "Bearer"
    // The format of the token should be: "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(" ")[1]; // Split the "Bearer <token>" string and take the second part (the actual token)
    }

    // If no token is found, throw an error indicating the user is not authenticated
    if (!token) {
      throw new Error("User not authenticated");
    }

    // Verify the token using the JWT_SECRET from environment variables
    // Promisify jwt.verify() to use it with async/await
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // After decoding, the `decoded` object contains the user ID, so use it to find the user in the database
    const currentUser = await User.findById(decoded.id);

    // If no user is found with the decoded ID, throw an error
    if (!currentUser) {
      throw new Error("User does not exist");
    }

    // Check if the user has changed their password after the token was issued
    // `decoded.iat` represents the timestamp when the token was issued
    // If the password has been changed after the token was issued, throw an error
    if (currentUser.changePasswordAfter(decoded.iat)) {
      throw new Error("User changed password after token was issued");
    }

    // If all checks pass, add the currentUser to the `req` object, so the user data can be accessed in subsequent middleware or route handlers
    req.user = currentUser;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If any error occurs, send a response with an error message and a 400 status code
    res.status(400).json({
      response: "Failed",
      error: err.message,
    });
  }
};
