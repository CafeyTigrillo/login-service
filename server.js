const express = require("express");
const sequelize = require("./config/database");
const swaggerUi = require('swagger-ui-express');
const authRoutes = require("./routes/authRoutes");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml'); 
const cors = require("cors");
const Eureka = require('eureka-js-client').Eureka;

const app = express();
const PORT = process.env.PORT || 3002;
const HOST = "0.0.0.0";

const eurekaClient = new Eureka({
  instance: {
    app: 'auth-service',
    hostName: 'ec2-13-216-183-248.compute-1.amazonaws.com',  
    ipAddr: '13.216.183.248',
    port: {
      '$': PORT,
      '@enabled': true,
    },
    vipAddress: 'auth-service',
    statusPageUrl: `http://13.216.183.248:${PORT}/info`, 
    healthCheckUrl: `http://13.216.183.248:${PORT}/health`, 
    homePageUrl: `http://13.216.183.248:${PORT}`,
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
    host: '13.216.183.248', 
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

app.listen(PORT, HOST, async () => { 
  try {
    await sequelize.sync({ force: false });
    eurekaClient.start(error => {
      console.log(error || 'Eureka registration complete');
    });
    console.log(`Login server running at http://13.216.183.248:${PORT}`);
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
