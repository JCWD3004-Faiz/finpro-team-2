import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import authRouter from './router/auth.router';
import productRouter from './router/product.router';
import shiftRouter from './router/shift.router';
import transactionRouter from './router/transaction.router';
import reportRouter from './router/report.router';
import adminRouter from './router/admin.router';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/shifts', shiftRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/reports', reportRouter);
app.use('/api/admin', adminRouter);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});