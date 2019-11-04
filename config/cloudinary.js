/* eslint-disable comma-dangle */
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

exports.upload = (file) => cloudinary.uploader.upload(file);
exports.delete = (fileID) => cloudinary.uploader.destroy(fileID);
