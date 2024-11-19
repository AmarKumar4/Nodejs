import DataURIParser from  "datauri/parser.js";
import path from "path";


export const getDataUri = (file)=>{
    console.log("hello")
    // if (!req.file) {
    //     return res.status(400).send({
    //         success: false,
    //         message: "No file uploaded",
    //     });
    // }
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname).toString();
    

    return parser.format(extName, file.buffer);
}


// Why It’s Used: This changes a file into a text format, making it easy to send or save without 
// needing to keep the actual file.