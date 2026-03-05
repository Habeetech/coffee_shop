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
    return res.status(409).json({
      success: false,
      message: "Duplicate value"
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