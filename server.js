const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const morgan = require("morgan");
const logger = require("./utils/logger");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/db");
// const sendEmail = require('./utils/sendEmail')

// Routes
const mountRoutes = require("./routes");

// Connect with db
dbConnection();

// express app
const app = express();

// // 3) Send the reset code via email
// const message = `<h1>Hi SenSe1</h1>,\n We received  `;
// try {
//   sendEmail({
//     email: "mbarkihoussem99@gmail.com",
//     subject: "Test nodemailer",
//     message,
//   });
// } catch (err) {
//   console.log(err);
// }

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Middlewares
app.use(express.json({ limit: "20kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
} else {
  app.use(logger);
}

// Data Sanitization :
// By default, $ and . characters are removed completely from user-supplied input in the following places:
app.use(mongoSanitize());
app.use(xss());

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Corrected to allow 100 requests per 15 minutes
  message: {
    message:
      "Too many requests from this IP, please try again after an hour",
  },
});

// Apply the rate limiting middleware to all requests
app.use("/", limiter);

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
