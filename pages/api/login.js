//We need to connect to the database to check the authenticity of the user
import connectDb from "../../utils/connectDb";
import User from "../../models/User";
//We need to decrypt and encrypt password
import bcrypt from "bcrypt";
//We need to use token for cookies and we use json web token(jwt)
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
    const { email, password } = req.body;
    try {
        //Find the user in our database using his/her email
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
                  return res.status(404).send("No user exists with that email");
        }
        //Does the password supplied by the user match with the one in the database?
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {

        expiresIn: "7d"
      });

            //send the generated token
            res.status(200).json(token);
        } else {
            //The passwrods don't match
            res.status(401).send("Passwords do not match");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in user");
    }
};