const express = require("express");
const sequelize = require("./config/database");
const swaggerUi = require('swagger-ui-express');
const authRoutes = require("./routes/authRoutes");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml'); 
const cors = require("cors");
const Eureka = require('eureka-js-client').Eureka;

const app = express();

const eurekaClient = new Eureka({
  instance: {
    app: 'auth-service',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': process.env.PORT || 3002,
      '@enabled': true,
    },
    vipAddress: 'auth-service',
    statusPageUrl: `http://localhost:${process.env.PORT || 3002}/info`,
    healthCheckUrl: `http://localhost:${process.env.PORT || 3002}/health`,
    homePageUrl: `http://localhost:${process.env.PORT || 3002}`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
    leaseRenewalIntervalInSeconds: 30,
    leaseExpirationDurationInSeconds: 90,
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
    heartbeatInterval: 5000,
    registryFetchInterval: 5000,
  },
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/info', (req, res) => {
  res.json({
    app: 'auth-service',
    status: 'UP',
    timestamp: new Date()
  });
});

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    eurekaClient.start(error => {
      console.log(error || 'Eureka registration complete');
    });
    console.log(`Login server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
});

process.on('SIGINT', () => {
  eurekaClient.stop(error => {
    console.log('Deregistered from Eureka');
    process.exit();
  });
});