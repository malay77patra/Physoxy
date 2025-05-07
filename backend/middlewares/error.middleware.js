
const globalErrorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error occurred`);
    console.error(`Name: ${err.name}`);
    console.error(`Message: ${err.message}`);
    if (err.stack) {
        console.error(`Stack: ${err.stack}`);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: "Something went wrong!",
        details: 'something went wrong, please checkout the error logs'
    });
};


module.exports = {
    globalErrorHandler
};