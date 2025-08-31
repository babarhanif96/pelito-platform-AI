const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const multer = require("multer");

const s3 = new aws.S3({
  accessKeyId: process.env.Access_Key_ID,
  secretAccessKey: process.env.Secret_Access_Key,
});

exports.uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    // acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),  
});
