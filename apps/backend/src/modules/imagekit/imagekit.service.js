import imageKit from "imagekit"
import AppError from "../../utils/AppError.js";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL;
const imageKitObj = new imageKit({
        publicKey: publicKey, 
        privateKey: privateKey,
        urlEndpoint: urlEndpoint});

export async function uploadFile(file) {
    const timestamp = new Date()
    if(!file) {
        throw new AppError("No file found", 400);
    }
    const res = await imageKitObj.upload({
        file: file.buffer,
        fileName: `${timestamp}-${file.originalname}`
    })
    if (res) {
        return res.url;
    }
    return;
}
