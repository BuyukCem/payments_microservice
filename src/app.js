import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import xss from 'xss-clean';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(xss());
app.use(cors());

const paymentRoute = require('./routes/payment.route');
paymentRoute(app);

export default app;
