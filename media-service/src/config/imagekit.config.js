import ImageKit from "imagekit";
import mongoose from "mongoose";


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, folder = "wall-paint-visualizer") {
    return new Promise((resolve, reject) => {

        const fileName =
            new mongoose.Types.ObjectId().toString() +
            "-" +
            file.originalname;

        imagekit.upload(
            {
                file: file.buffer,
                fileName,
                folder
            },
            (error, result) => {

                if (error) {
                    console.error("ImageKit Error Details:", error);
                    reject(error);
                } else {

                    resolve({
                        url: result.url,
                        fileId: result.fileId,
                        thumbnailUrl: result.thumbnailUrl,
                        name: result.name,
                        size: result.size,
                        width: result.width,
                        height: result.height
                    });

                }
            }
        );
    });
}


export { uploadFile };
export default imagekit;