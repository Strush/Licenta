import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                name: {type: String, required: true},
                slug: {type: String, required: true},
                quantity: {type:  Number, required: true},
                price: {type: Number, required: true},
                image: {type: String, required: true},
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
            },
        ],
        shippingAddress: {
            address: {type: String, required: true},
            city: {type: String, required: true},
            country: {type: String, required: true},
            fullname: {type: String, required: true},
            phoneNumber: {type: String, required: true},
        },
        paymentMethod: {type: String, required: true},
        paymentResults: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        totalPrice: {type: Number, required: true},
        deliveredPrice: {type: Number},
        isPaid: {type: Boolean, default: false},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        paidAt: {type: Date},
        isDelivered: {type: Boolean, default: false},
        deliveredAt: {type: Date} 
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Orders',OrderSchema);
export default Order;