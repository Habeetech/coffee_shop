import * as imagekitService from "./imagekit.service.js"
export async function uploadFile (req, res) {
    const url = await imagekitService.uploadFile(req.file);
    res.status(201).json(url);
}