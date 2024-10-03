import { createLogger, format, Logger, transports } from "winston";
const env = process.env.NODE_ENV || "development";

const devformat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);
const prodformat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );
const logger: Logger = createLogger({
    level: env === 'development' ? 'silly' : 'info', 
    format: env === 'development' ? devformat : prodformat,
    transports: [
      new transports.Console({
        level: env === 'development' ? 'silly' : 'info', 
        format: env === 'development' ? devformat : prodformat,
      }),
    ],
    exceptionHandlers: [
        new transports.Console({
            format: env === 'development' ? devformat : prodformat,
          })
    ],
    rejectionHandlers: [
        new transports.Console({
            format: env === 'development' ? devformat : prodformat,
          })
    ],
  });

  export default logger;