import express from "express"
import colors from "colors"
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"
import testRoutes from "../server/routes/testRoutes.js"
import connectDB from "./config/db.js";
import userRoutes from "../server/routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cloudinary  from "cloudinary"

// config
dotenv.config()
connectDB();

// cloudinary config
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})
const app = express();
app.use(express.json());
app.use(morgan("dev"))
app.use(cors());
app.use(cookieParser())

app.use("/api/v1", testRoutes)

app.use("/api/v1/user", userRoutes)
app.get("/", (req, res) => {
    return res.status(200).send("<h1>hello</h1>")

})

const port = process.env.port || 8080;
app.listen(port, () => {
    console.log("running server", port.bgRed)
})

