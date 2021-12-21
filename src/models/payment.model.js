import mongoose, {Schema} from 'mongoose';

const PaymentSchema = new Schema({
    payed: {type: Number, required: true},
    productId: {type: String, required: true},
    buyerId: {type: String, required: true}
}, {
    timestamps: true
});

PaymentSchema.pre('validate', async function (next) {
    if (!this.payed) return next;
    this.payed = Math.floor(this.payed * 100)
    next();
});
PaymentSchema.statics.checkExistingField = async function (field, value) {
    const payment = this;

    return payment.findOne({[`${field}`]: value});
};

export default mongoose.model('Payment', PaymentSchema, 'payments');
