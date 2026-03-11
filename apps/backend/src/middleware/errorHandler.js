import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];

    const messages = {
      email: "Email already exist. Please choose a different email",
      username: "Username already exist. Please choose a different username",
      phone: "Phone number already exist. Please choose a different phone number"
    };

    return res.status(409).json({
      success: false,
      message: messages[field] || "Duplicate value"
    });
  }


  if (err?.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong"
  });
};

export default errorHandler;