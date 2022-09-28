const express = require("express");
const app = express();
const multer = require("multer");
const port = process.env.PORT || 3000;
const path = require("path");

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

//Initializing upload
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = function (file, cb) {
  //Allowed ext
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check ext
  const extName = fileTypes.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Upload Images Only!!");
  }
};

app.post("/single", upload.single("image"), (req, res) => {
  console.log(req.file);
  if (req.file) {
    res.send("Single file uploaded successfully");
  } else {
    res.status(404).send("Please upload a valid image");
  }
});



app.post("/multiple", upload.array("images", 5), (req, res) => {
  console.log(req.files);

  if (req.files) {
    res.send("Muliple files uploaded successfully");
  } else {
    res.status(404).send("Please upload a valid images");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


