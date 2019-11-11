/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const multer = require('./multer');
const { loggedInToken, loggedInUserId } = require('./user');
const app = require('../app');

let cloudId = '';
let gifId = null;

describe('Upload, get and delete gif from database', () => {
  it('Should upload a gif file to cloudinary and save its generated properties in database', () => {
    request(app).post('/api/v1/gifs')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('title', 'Puffy cat')
      .field('userId', `${loggedInUserId}`)
      .attach('image', './test/test_image/dog.gif')
      .then((res) => {
        res.should.have.status(200);
        res.status.should.equal('success');
        res.data.message.should.equal('GIF image successfully posted');
        res.data.gifId.should.exist;
        res.data.cloudId.should.exist;
        res.data.imageUrl.should.exist;
        res.data.title.should.exist;
        res.data.title.should.exist;
        cloudId = res.data.cloudId;
        gifId = res.data.gifId;
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.exist;
        });
      });
  });
  it('Should get a single gif and its comments from database', () => {
    request(app).get(`/api/v1/gifs/${gifId}`)
      .then((res) => {
        res.should.have.status(200);
        res.status.should.equal('success');
        res.data.content.should.exist;
        res.data.comments.should.exist;
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(`Unable to view gif with id: ${id}, ${err}`);
        });
      });
  });
  it('Should delete gif file from both cloudinary and database', () => {
    request(app).delete(`/api/v1/gifs/${gifId}`)
      .then((res) => {
        res.should.have.status(200);
        res.status.should.equal('success');
        res.data.message.should.equal('GIF image successfully deleted');
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.have(err);
        });
      });
  });
});
