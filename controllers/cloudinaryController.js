const cloudinary = require('../config/cloudinary.js');


class CloudinaryController {

    static uploadSingleImage = async (req, res) => {
      try {
        const file = req.files.image;
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          public_id: `${Date.now()}`,
          resource_type: "auto",
          folder: "images",
        });
        console.log(result.url);
        res.status(200).send({ status: 200, message: "Image Uploaded Successfully", data: result.url });
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: "Server Error" });
      }
    }
}

module.exports = CloudinaryController;