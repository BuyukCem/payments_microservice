const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY_PRD);

module.exports.stripe = {
    createCustomer: async (email, name) => {
        try {
            const customer = await stripe.customers.create(
                {
                    email: email,
                    name: name
                }
            );
            return ({
                customerId: customer.id,
                customerEmail: customer.email,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    createCard: async (cardName, cardNumber, cardExpMonth, cardExpYear, cardCVC, country, postal_code, customerId) => {
        try {
            const cardToken = await stripe.tokens.create({
                card: {
                    name: cardName,
                    number: cardNumber,
                    exp_month: cardExpMonth,
                    exp_year: cardExpYear,
                    cvc: cardCVC,
                    address_country: country,
                    address_zip: postal_code,
                },
                // customer: customer.stripe_id,
                // stripe_account: StripeAccountId,
            });
            const card = await stripe.customers.createSource(customerId, {
                source: `${cardToken.id}`,
            });
            return ({
                cards: card.id,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getListOfAllSavedCardForCustomer: async (customerId) => {
        let cards = [];
        try {
            const savedCards = await stripe.customers.listSources(customerId, {
                object: "card",
            });
            const cardDetails = Object.values(savedCards.data);
            cardDetails.forEach((cardData) => {
                let obj = {
                    cardId: cardData.id,
                    cardType: cardData.brand,
                    cardExpDetails: `${cardData.exp_month}/${cardData.exp_year}`,
                    cardLast4: cardData.last4,
                };
                cards.push(obj);
            });
            return ({
                cardDetails: cards,
            });
        } catch (error) {
            return res.status(400).send({
                Error: error.raw.message,
            });
        }
    },
    deleteCard: async (customerId, cardId) => {
        try {
            const card = await stripe.customers.deleteSource(customerId, cardId);
            return ({
                card: card,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    createChargeWithSavedCard: async (email, amount, currency, customerId, cardId) => {
        try {

            const createCharge = await stripe.charges.create({
                amount: amount * 100,
                currency: currency,
                receipt_email: email,
                customer: customerId,
                card: cardId,
                description: `Stripe Charge Of Amount ${amount} for Payment`,
            });
            if (createCharge.status === "succeeded") {
                return ({Success: createCharge});
            } else {
                return ({Error: "Please try again later for payment"});
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    createChargeWithOutSavedCard: async (currency,cardNumber, cardExpMonth, cardExpYear, cardCVC, country, postalCode,
                                         amount, email) => {
        try {
            const cardToken = await stripe.tokens.create({
                card: {
                    number: cardNumber,
                    exp_month: cardExpMonth,
                    exp_year: cardExpYear,
                    cvc: cardCVC,
                    address_country: country,
                    address_zip: postalCode,
                },
            });
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: currency,
                payment_method_types: ['card'],
            });

            const charge = await stripe.charges.create({
                amount: amount,
                currency: currency,
                source: cardToken.id,
                receipt_email: email,
                description: `Stripe Charge Of Amount ${amount} for One Time Payment`,
            });
            if (charge.status === "succeeded") {
                return ({Success: charge});
            } else {
                return ({Error: "Please try again later for payment"});
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
