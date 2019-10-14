import User from "../../models/User";
//To verify the token, we need to import jwt
import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";


connectDb();
export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
            break;
    }

};
//Making our async route
async function handleGetRequest(req, res) {
    //if(!req.headers.authorization)
    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    //The user has authorization token
    try {
        //destructuring
        const { userId } = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        const user = await User.findOne({ _id: userId });
        //If the user exists in the database
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(403).send("Invalid token");
    }
}

async function handlePutRequest(req, res) {
  const { _id, role } = req.body;
  await User.findOneAndUpdate({ _id }, { role });
  res.status(203).send("User updated");
}