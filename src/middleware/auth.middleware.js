import configs from "../configs";
import { defaultErrorHandler } from "../utils/error";

export const authCheck = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return defaultErrorHandler({ status: 401, message: "No token found" });
    }
    jwt.verify(token, configs.JWT_SECRET, (error, user) => {
        if (error) return defaultErrorHandler({ status: 401, message: error });
        req.user = user;
        next();
    });
    return defaultErrorHandler({ status: 401, message: "Invalid user token" });
};
export const verifyStudent = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return defaultErrorHandler({ status: 401, message: "No token found" });
    }
    jwt.verify(token, configs.JWT_SECRET, (error, user) => {
        if (error) return defaultErrorHandler({ status: 401, message: error });
        if (user.role === "student") next();
        else
            return defaultErrorHandler({
                status: 401,
                message: "Invalid student token",
            });
    });
};

export const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return defaultErrorHandler({ status: 401, message: "No token found" });
    }
    jwt.verify(token, configs.JWT_SECRET, (error, user) => {
        if (error) return defaultErrorHandler({ status: 401, message: error });
        if (user.role === "admin") next();
        else
            return defaultErrorHandler({
                status: 401,
                message: "Invalid admin token",
            });
    });
};
