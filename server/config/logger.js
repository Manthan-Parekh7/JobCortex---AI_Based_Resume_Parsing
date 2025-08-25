import winston from "winston";
import appRoot from "app-root-path";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define format for console output
const consoleFormat = combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level}]: ${stack || message}`;
    })
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.json(),
    transports: [
        // Daily rotating error log file
        new DailyRotateFile({
            filename: `${appRoot}/logs/error-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            level: "error",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d", // Keep logs for 14 days
            handleExceptions: true,
        }),
        // Daily rotating combined logs (info and above)
        new DailyRotateFile({
            filename: `${appRoot}/logs/combined-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});

// If not in production, log to the console with colorized output
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: consoleFormat,
            handleExceptions: true,
            level: "debug",
        })
    );
}

export default logger;
