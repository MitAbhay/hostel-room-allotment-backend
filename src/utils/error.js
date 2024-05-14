export const defaultErrorHandler = ({ res, status, message }) => {
    return res.status(status || 500).json({
        success: false,
        message: message || "Something went wrong!",
    });
};
