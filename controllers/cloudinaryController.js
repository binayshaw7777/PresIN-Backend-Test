class CloudinaryController {

  static uploadSingleImage = async (req, res) => {
    try {
        res.status(200).json({ status: 200, message: 'Image uploaded successfully', result: req.file.path });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
  }
}

module.exports = CloudinaryController;