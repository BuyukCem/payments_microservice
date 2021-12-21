let customerId = "";
let cardId = "";
export const paymentTest = (app, request) => {
    it('Should createCustomer', async () => {
        await request(app)
            .post('/customer')
            .send({
                "email": "emailTest@gmail.com",
            })
            .then(response => {
                const res = JSON.parse(response.text)
                expect(response.status).toBe(200)
                customerId = res.customerId
                expect(res.customerEmail).toBe('emailTest@gmail.com')
            });
    });
    it('Should create card', async () => {
        await request(app)
            .post('/card')
            .send({
                "customerId": customerId,
                "cardNumber": "4242424242424242",
                "cardExpMonth": "12",
                "cardExpYear": "2021",
                "cvv": "123",
                "cardName": "Test Card",
                "country": "France",
                "postal_code": "93390"
            })
            .then(response => {
                const res = JSON.parse(response.text)
                expect(response.status).toBe(200)
                expect(res).toHaveProperty('cards')
            });
    })
    it('Should get all customer card', async () => {
        await request(app)
            .get('/card')
            .send({
                "customerId": customerId,
            })
            .then(response => {
                const res = JSON.parse(response.text)
                expect(response.status).toBe(200)
                expect(res.cardDetails[0].cardExpDetails).toBe('12/2021')
                expect(res.cardDetails[0].cardLast4).toBe('4242')
                cardId = res.cardDetails[0].cardId;
            });
    })
    it('Should intents payment', async () => {
        console.log(cardId)
        console.log(customerId)
        await request(app)
            .post('/intents/' + customerId)
            .send({
                "email": "emailTest@gmail.com",
                "customerId": customerId,
                "cardId": cardId,
                "amount": "100",
                "currency": "eur",
                "description": "Test payment"
            })
            .then(response => {
                const res = JSON.parse(response.text)
                console.log(res)
                expect(response.status).toBe(200)
                expect(res).toHaveProperty('Success')
            });
    })
    it('Should delete card', async () => {
        await request(app)
            .delete('/card')
            .send({
                "customerId": customerId,
                "cardId": cardId
            })
            .then(response => {
                const res = JSON.parse(response.text)
                expect(response.status).toBe(200)
            });
    })
}
