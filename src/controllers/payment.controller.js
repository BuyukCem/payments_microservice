import {ApplicationError} from "../helpers/errors.helper";
import {stripe} from "../services/stripe.service";


exports.newCustomer = async (req, res, next) => {
    if (!req.body.email) {
        res.status(400).json({
            message: "Email is required"
        });
    }
    try {
        const data = await stripe.createCustomer(req.body.email)
        res.status(200).json(data);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}
exports.addNewCard = async (req, res, next) => {
    const {
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cvv,
        cardName,
        country,
        postal_code,
        customerId
    } = req.body;
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cvv || !cardName || !country || !postal_code || !customerId) {
        return res.status(400).send({
            Error: "Please Provide All Necessary Details to save the card",
        });
    }
    try {
        const data = await stripe.createCard(cardName, cardNumber, cardExpMonth, cardExpYear, cvv, country, postal_code, customerId)
        res.status(200).json(data);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}

exports.getAllCard = async (req, res, next) => {
    const {
        customerId
    } = req.body;
    try {
        const data = await stripe.getListOfAllSavedCardForCustomer(customerId)
        res.status(200).json(data);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}
exports.deleteCard = async (req, res, next) => {
    const {
        customerId,
        cardId
    } = req.body;
    if (!customerId || !cardId) {
        return res.status(400).send({
            Error: "Please Provide All Necessary Details to save the card",
        });
    }
    try {
        const data = await stripe.deleteCard(customerId, cardId)
        res.status(200).json(data);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}

exports.createIntentsChargeWithCustomerId = async (req, res, next) => {
    const {amount, cardId, email, customerId, currency, description} = req.body;
    if (!amount || !cardId || !email || !customerId || !currency || !description) {
        return res.status(400).json({
            message: "Please Provide All Necessary Details to create charge",
        });
    }
    try {
        const createCharge = await stripe.createChargeWithSavedCard(email, amount, currency, customerId, cardId)
        res.status(200).json(createCharge);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}
exports.createIntentsWithoutSavedCard = (req, res, next) => {
    const {
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCVC,
        country,
        postalCode,
        amount,
        email,
    } = req.body;
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC || !country || !postalCode || !amount || !email) {
        return res.status(400).send({
            Error: "Please Provide All Necessary Details to create charge",
        });
    }
    try {
        const createCharge = stripe.createChargeWithOutSavedCard(cardNumber,
            cardExpMonth,
            cardExpYear,
            cardCVC,
            country,
            postalCode,
            amount)
        res.status(200).json(createCharge);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}

exports.confirmeIntentsPayment = (req, res, next) => {
    const {
        paymentIntentId,
        amount,
        currency,
        description,
        email,
        customerId
    } = req.body;
    // retrive
}
