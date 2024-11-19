import JWT from "jsonwebtoken";
import userModel from '../models/userModel.js';

export const isAuth = async (req, res, next) => {
    const { token } = req.cookies;

    // Check if token is provided
    if (!token) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized user",
        });
    }

    try {
        // Verify the token and decode the user ID
        const decodeData = JWT.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Data:", decodeData);


        // Find the user in the database
        const user = await userModel.findById(decodeData.id);

        // If no user found, return an error
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Set the user information in req.user and move to the next middleware
        req.user = user;
        next();
    } catch (error) {
        // If token verification fails or another error occurs
        res.status(401).send({
            success: false,
            message: "Authentication failed",
        });
    }
};
