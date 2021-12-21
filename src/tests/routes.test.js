import 'core-js/stable';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import app from '../app';

const {paymentTest} = require('./payment.test')

describe('payment test', ()=>{paymentTest(app, request)})
