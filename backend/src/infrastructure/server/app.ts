import express from 'express';
import cors from 'cors';
import {
  routesController,
  complianceController,
  bankingController,
  poolingController,
} from '../../shared/dependencies.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes endpoints
app.get('/routes', (req, res) => routesController.getAllRoutes(req, res));
app.post('/routes/:routeId/baseline', (req, res) => routesController.setBaseline(req, res));
app.get('/routes/comparison', (req, res) => routesController.getComparison(req, res));

// Compliance endpoints
app.get('/compliance/cb', (req, res) => complianceController.getComplianceBalance(req, res));
app.get('/compliance/adjusted-cb', (req, res) =>
  complianceController.getAdjustedComplianceBalance(req, res)
);

// Banking endpoints
app.get('/banking/records', (req, res) => bankingController.getBankRecords(req, res));
app.post('/banking/bank', (req, res) => bankingController.bankSurplus(req, res));
app.post('/banking/apply', (req, res) => bankingController.applyBanked(req, res));

// Pooling endpoints
app.post('/pools', (req, res) => poolingController.createPool(req, res));

export default app;

