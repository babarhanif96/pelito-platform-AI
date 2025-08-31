const express = require("express");
const router = express.Router();

const { uploadSingleFile, uploadMultiFile} = require("../utils/upload")
const { uploadS3 } = require('../middleware/uploadMiddleware.js');

router.post("/single-upload", uploadS3.single("media"), uploadSingleFile);
router.post("/multi-upload", uploadS3.array("media"), uploadMultiFile);

module.exports = router;
