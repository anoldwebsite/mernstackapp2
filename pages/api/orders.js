import Order from "../../models/Order";
import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const orders = await Order.find({ user: userId })
        .sort({ createdAt: "desc" })//for descending order. for ascending order write "asc"
        //-1 och 1 also works. with desc the latest orders are on the top
        .populate({
            path: "products.product",
            model: "Product"
        });
        res.status(200).json({ orders });//Now that we have array of orders we can destructure it in account.js
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
}