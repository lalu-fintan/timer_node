const morgan = require("morgan");
const userRouter = require("./userRouter");
const googleRouter = require("./googleRouter");
const { notFound, errorHandler } = require("../middleware/errorHandler");

const mainRouter = (app) => {
  app.use(morgan("dev"));
  app.use("/api/user", userRouter);
  app.use("/", googleRouter);

  //   error handler
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = mainRouter;
