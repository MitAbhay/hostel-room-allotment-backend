import env from "dotenv";
// env config
env.config();

const configs = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_STRING,
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES: 7 * 24 * 60 * 60,
};

export default configs;
