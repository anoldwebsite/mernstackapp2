// import products from "../../static/products.json";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
    const {page, size} = req.query//page and size are strings at this point
    //Converting query string values to numbers
    const pageNum = Number(page);
    const pageSize = Number(size);
    let products = [];
    try {
        const totalDocs = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocs/pageSize);//We don't want to leave the last few products
    if(pageNum === 1){
        products = await Product.find().sort(
            {
                price: "asc"
            }
        ).limit(pageSize);
    }else{
        const documentsToSkip = (pageNum - 1) * pageSize;
        products = await Product.find().skip(documentsToSkip).limit(pageSize);
    }
    /* We need to tell MongoDB that the first 9 documents are not needed.
    For page 2, I want to skip 9 documents = (2 - 1) * 9 = (2 - 1) * pageSize = (pagenNum - 1) * pageSize
    For page 3, I want to skip 18 documents = (3 - 1) * 9 = (3 - 1) * pageSize = (pagenNum - 1) * pageSize
    For page 4, I want to skip 27 documents = (4 - 1) * 9 = (4 - 1) * pageSize = (pagenNum - 1) * pageSize
    For page 5, I want to skip 36 documents = (5 - 1) * 9 = (5 - 1) * pageSize = (pagenNum - 1) * pageSize
    For page n, I want to skip                            = (n - 1) * pageSize = (pagenNum - 1) * pageSize
     */
    //How many links do we need? Number of links === Number of pages
 
   res.status(200).json({ products, totalPages });//We are sending an object
    } catch (error) {
        
    }
};