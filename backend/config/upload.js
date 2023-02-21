const { connection } = require("mongoose");
const myerr = require("../helper/customErr")
// to accept multipart/form request
const multer = require("multer");

// to upload files in database as gridfs storage
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
    db: connection,
    file: (req, file) => {
        if (file.mimetype == 'audio/mpeg') {
            return {
                filename: Date.now() + "." + file.mimetype.split('/')[1],
                bucketName: 'songs'
            }
        }
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            return {
                filename: Date.now()+"." + file.mimetype.split('/')[1],
                bucketName: "images"
            }
        }
        throw new myerr("invalid file type", 400);
    }
})

const upload = multer({ storage: storage });

module.exports = upload;