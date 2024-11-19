import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import JWT from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
        },
        country: {
            type: String,
            required: [true, "Country is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        profilePic: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);
// This code checks if the password is new or updated, and if so, it scrambles (hashes) it before saving.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
})
// compare password
userSchema.methods.comparePassword = async function (plainpassword) {
    return await bcrypt.compare(plainpassword, this.password);

}

// jwt token
// jwt token
userSchema.methods.generateToken = function () {  // corrected the typo here
    return JWT.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// Correct export syntax
const User = mongoose.model("User", userSchema);
export default User;
