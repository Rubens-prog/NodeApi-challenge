require("express-async-errors");
const express = require("express");
const swaggerDocument = require("../swagger.json");

const AppError = require("./utils/AppError");

const swaggerUi = require("swagger-ui-express");

const routes = require("./routes");

const app = express();

app.use(express.json());

app.use(routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "Error",
    message: "Internal server error",
  });
});

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
