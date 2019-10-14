import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";

connectDb();
//MongoDb provides a function, objectId, that can change a string
// to an object. We will use it to change our productId that we have
//destructured and which is a string now. We need it as an object to 
//compare it with the object in the array of products in the cart.
const { ObjectId } = mongoose.Types;

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        case "DELETE":
            await handleDeleteRequest(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method}  not allowed`);
            break;
    }
};

async function handleGetRequest(req, res) {

    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    //If you are here, the user has an authorizatio token
    try {
        //verify the json web token
        const { userId } = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        //Now, we have a userId and using that we can get cart for this user from our MongoDb
        const cart = await Cart.findOne({ user: userId }).populate({
            path: "products.product",
            model: "Product"
        });
        res.status(200).json(cart.products);//We just need the products array form the Cart model
    } catch (error) {
        console.error(error);
        //Invalid token
        res.status(403).send("Please login again");
    }
}
async function handlePutRequest(req, res){
    const  { quantity, productId } = req.body;
    if( !("authorization" in req.headers) ){
        return res.status(401).send("No authorization token");
    }
    try {
        //verify the token
        const { userId } = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        //Now, we need to update the array products in our model cart in cart.js
        //For this we need to grab cart for this user using his/her userId
        const cart = await Cart.findOne({ user: userId });
        //some is a function that will check the array products and return true even if one element matches 
        const productExistsInCart = cart.products.some(doc => ObjectId(productId).equals(doc.product));
        //Check if the product already exists in the cart. 
        if(productExistsInCart){
            //Increase the quantity of the product by the number requested
            await Cart.findOneAndUpdate(
                {_id: cart._id, "products.product": productId},
                { $inc: {"products.$.quantity": quantity }}//Increment the quantity by the number equal to the variable quantity
            );
        }
        else {
            //If the product does not exist already in the cart of the user
            //then create add the new product and the quantity
            const newProduct = { quantity, product: productId };
            await Cart.findOneAndUpdate(
                {_id: cart._id},
                {$addToSet: { products: newProduct }}
            );
        }
        res.status(200).send("Cart updated");
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
}

async function handleDeleteRequest(req, res){
    const {productId} = req.query;
    if(!("authorization" in req.headers)){
        return res.status(401).send("No authorization token");
    }
    try {
        //verify the token of the user
        const {userId} = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        const uppdatedCart = await Cart.findOneAndUpdate(
            {user: userId},
            { $pull: { products: { product: productId } } },
            { new: true }
        ).populate({
            path: "products.product",
            model: "Product"
        });
        res.status(200).json(uppdatedCart.products);
    } catch (error) {
        console.error(error);
        res.status(403).send("Please log in again");
    }
}