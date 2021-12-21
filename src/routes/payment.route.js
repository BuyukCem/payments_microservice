const paymentController = require('../controllers/payment.controller')
import {middleware} from '../middleware/authenticate.middleware';


module.exports = (app) => {
   app.route('/customer')
       .post(paymentController.newCustomer)
   app.route('/card')
       .get(paymentController.getAllCard)
       .post(paymentController.addNewCard)
       .delete(paymentController.deleteCard)
   app.route('/intents/:customer_id')
       .post(paymentController.createIntentsChargeWithCustomerId)

   app.route('/intents')
       .post(paymentController.createIntentsWithoutSavedCard)
   app.route('/intents/confirme')
       .post(paymentController.confirmeIntentsPayment)
}
