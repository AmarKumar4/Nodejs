import userModel from "../models/userModel.js";
import cloudinary from "cloudinary"
import { getDataUri } from "../utils/features.js";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, address, city, country, phone } = req.body;

        // Validation
        if (!name || !email || !password || !city || !address || !country || !phone) {
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields"
            });
        }
        // check existing user 
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: "email already exist"
            })
        }

        // Create new user
        const user = await userModel.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone
        });

        res.status(201).send({
            success: true,
            message: "Registration successful",
            user
        });

    } catch (error) {
        console.error("Registration error:", error);  // Logs full error with stack trace in the console

        res.status(500).send({
            success: false,
            message: "Error in Register API",
            error: error.message || error.toString(),  // Sends readable error message
        });
    }
};


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Compare password (assuming you have a method on user instance to compare passwords)
        const isMatch = await user.comparePassword(password);  // Update method based on your schema setup
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid password"
            });
        }

        const token = user.generateToken();
        // Successful login response
        res.status(200).cookie("token", token).send({
            success: true,
            message: "Login successful",
            user,
            token,
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).send({
            success: false,
            message: "Error in login API",
            error: error.message || error.toString(),
        });
    }
};

// get user profile
export const getUserProfileController = async (req, res) => {

    try {
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            user: req.user, // User data from isAuth middleware
        });

    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "user profile not"
        })

    }

}
export const logoutController = async (req, res) => {
    try {
        // Clear the cookie by setting its value to an empty string and past expiration date
        res.status(200).cookie("token", "", {
            httpOnly: true,  // Ensures that the cookie can't be accessed through JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production (only sent over HTTPS)
            expires: new Date(0), // Expire the cookie immediately
        }).send({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).send({
            success: false,
            message: "Error in logout",
        });
    }
};
// updating the profile

export const updatedProfile = async (req, res) => {  // Add `req` and `res` here
    try {
        const user = await userModel.findById(req.user.id);
        const { name, email, address, city, country, phone } = req.body;

        // Update fields if they are provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;

        await user.save();
        res.status(200).send({
            success: true,
            message: "User profile updated"
        });

    } catch (error) {  // Pass `error` into the `catch` block
        console.error("Profile update error:", error);
        res.status(500).send({
            success: false,
            message: "Error in updating profile",
            error: error.message || error.toString(),
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        const {oldPassword,newPassword} = req.body;
        // validation
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success:false,
                message:"please provide old or new password"
            })
        }
        const isMatch = await user.comparePassword(oldPassword)
        // validation
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:"invalid old password"
            })
        }
        user.password = newPassword
        user.save()
        res.status(200).send({
            success:true,
            message:"succesfully password updated"
        })

    }
    catch (error) {  // Pass `error` into the `catch` block
        console.error("Profile update error:", error);
        res.status(500).send({
            success: false,
            message: "Error in updating password",
            error: error.message || error.toString(),
        });

    }
}

// export const updateProfilePic = async (req, res) => {
//     try {
//         console.log("helo")
//         const user = await userModel.findById(req.user._id);
//         console.log(user)

//        console.log(req.file)
//         // Verify if file is present
//         if (!req.file) {
//             return res.status(400).send({
//                 success: false,
//                 message: "No file uploaded",
//             });
//         }

//         const file = getDataUri(req.file);

//         // Delete previous photo
//         if (user.profilepic && user.profilepic.public_id) {
//             await cloudinary.v2.uploader.destroy(user.profilepic.public_id);
//         }

//         // Upload new photo
//         const cdb = await cloudinary.v2.uploader.upload(file.content);
//         user.profilepic = {
//             public_id: cdb.public_id,
//             url: cdb.secure_url,
//         };

//         // Save user profile
//         await user.save();
//         res.status(200).send({
//             success: true,
//             message: "Profile pic updated",
//         });

//     } catch (error) {
//         console.error("Profile update error:", error);
//         res.status(500).send({
//             success: false,
//             message: "Error in updating profile picture",
//             error: error.message || error.toString(),
//         });
//     }
// };
export const updateProfilePic = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);

   
      // file get from client photo
      const file =  getDataUri(req.file);
    //   console.log("&&&&&&&&&&&&&&&&&&&&&&&")

    
      // delete prev image
    //   await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
      // update
      const cdb = await cloudinary.v2.uploader.upload(file.content);
      user.profilePic = {
        public_id: cdb.public_id,
        url: cdb.secure_url
      };
      // save func
      await user.save();
  
      res.status(200).send({
        success: true,
        message: "profile picture updated",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In update profile pic API",
        error,
      });
    }
  };