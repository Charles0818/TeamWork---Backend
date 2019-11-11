/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const multer = require('multer');

let storage = null;
describe('multer: a middleware for handling files', () => {
  it('should replace any space in the file with underscore, if any..', () => {
    storage = multer.diskStorage({
      filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        expect.name.to.exist;
        callback(null, name);
      },
    });
  });
});

module.exports = multer({ storage }).any();
