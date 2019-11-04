const multer = require('multer');

// const MIME_TYPES = [
//   'image/jpg',
//   'image/png',
//   'image/jpeg',
//   'image/gif',
// ];
const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     if (MIME_TYPES.find((el) => file.mimetype === el)) callback(null, './public/assets/images');
//     else { callback({ message: 'This file is not a gif' }); }
//   },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    callback(null, name);
  },
});

module.exports = multer({ storage });
