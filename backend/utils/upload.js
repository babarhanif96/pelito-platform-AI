module.exports = { 

    uploadSingleFile :function (req,res) {
        let media  = req.file.location    
        res.status(200).json({media});
    },
    uploadMultiFile:function (req,res){
        let media = [];

        if (req.files.length > 0) {
          media = req.files.map((file) => {
            return {
              media: file.location,
            };
          });
          res.status(200).json(media);
        }
    }
}
