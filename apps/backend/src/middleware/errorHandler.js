const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message;

    if (err.name === "CastError") {
        error.message = `Resours not found. Invalid ${err.path}: ${err.value}`;
        error.statusCode = 400;
    }
    if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.statusCode = 400;
}
    console.error("DEBUG ERR:", err.name, err.message);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong!";
    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};
export default errorHandler;