const express = require("express");
const sequelize = require("./config/database");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./docs/swagger.yaml');  
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Login server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
