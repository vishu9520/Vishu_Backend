import {v2 as cloudinary} from "cloudinary"
import fs from "fs"// read write remove 

cloudinary.config({
    
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return {
            ...response,
            url: response.secure_url || response.url
        }
    } catch (error) {
        console.error("Cloudinary upload error:", error)
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath)
            } catch (unlinkErr) {
                console.error("Failed to delete temp file:", unlinkErr)
            }
        }
        return null
    }
}


// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
// {
//     public_id:"olympic_flag"
// },
// function(error,result){console.log(result);}
// );

export {uploadOnCloudinary}