
export const errorHandler = (err,req,res,next)=>{
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
