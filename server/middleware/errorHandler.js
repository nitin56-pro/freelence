// Simple global error handler
// Pure app me koi bhi error aayega toh ye function handle karega
const errorHandler = (err, req, res, next) => {
    // Agar status code 200 hai (matlab abhi set nahi hua) toh 500 set kardo
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode);
    
    // Error ka message JSON me bhej do
    res.json({
        message: err.message
    });
};

module.exports = errorHandler;
