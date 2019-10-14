import User from "../../models/User";
import jwt from "jsonwebtoken";

export default async (req, res) => {
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        //Get all the users of the app but not the one who has the role of "root"
        //ne means not equal to 
       const users = await User.find({ _id: { $ne: userId } })
       .sort(
            {
                name: "asc" //Sorting by the name of the user in the database. ascending order
                //for descending order write name: "desc"
                //Then login to your app as a root user and see the my account page
                //If I want to sort on the role of the user i.e., user, admin, root then
                //role: "asc" //for ascending order or "desc" for descending order
                //We can sort on email 
                //email: "asc" //Sort by email in ascending order
            }
       )
       res.status(200).json(users);//Let's go back to AccountPersmissons.js file
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};