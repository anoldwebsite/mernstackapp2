import Product from "../../models/Product";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";
import Order from "../../models/Order";


connectDb();

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "POST":
            await handlePostRequest(req, res);
            break;
        case "DELETE":
            await handleDeleteRequest(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
            break;
    }
};
async function handleGetRequest(req, res) {
    const { _id } = req.query;
    const product = await Product.findOne({ _id });
    res.status(200).json(product);//200 is ok status code
}

async function handlePostRequest(req, res) {
    const { name, price, description, mediaUrl } = req.body;
    try {
        if (!name || !price || !description || !mediaUrl) {
            //if the user leaves any of the fields on the form then return and inform the user
            return res.status(422).send("Product is missing one or more fields. Please complete all the fields.");
        }
        //Now, that we are here which means that the return inside the if was not used.
        //create a new product using the constructor of Product that we have imported.
        const product = await new Product({
            name,
            price,
            description,
            mediaUrl
        }).save();
        res.status(201).json(product);//201 status code for product created.
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error in creating product");
    }

}



async function handleDeleteRequest(req, res) {
    /* We need to delte the item but also pull out that item from all the carts of the buyers. */
    const { _id } = req.query;
    try {
        //Delete product by id
        await Product.findOneAndDelete({ _id });//Here we deleted one document at a time, called atomic update.
        //Remove product from all carts, referenced as 'product'. Here we need to update many documents 
        await Cart.updateMany(
            //the condition is that the product has the same id as we got from req.query i.e., _id
            { "products.product": _id },
            { $pull: { products: {product: _id} } }//Pull all the documents where the product has an id equal to the id _id which we got from req.query
        );
        //Remove product from all orders given by customers otherwise app would give errors on account page of all those customers who have bought this product
        await Order.updateMany(
            { "products.product": _id },
            { $pull: { products: {product: _id} } }
        );
        res.status(204).json({});//empty object
        //The delete was successful but no content being 
        //sent back. 204 is the status code for no content.
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting product");
    }
}