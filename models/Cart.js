import mongoose from "mongoose";

const { ObjectId, Number } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema({
    //Every cart is owned by a user so we have to have a user
    //identified by his/her id given by MongoDb automatically.
    user: {
        type: ObjectId, //ObjectId is sufficient. We do not need to write name, email etc for the user.
        ref: "User"
    },
    products: [
        {//An array of products is attached to every cart.
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: ObjectId,
                ref: "Product"
            }
        }
    ]
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
