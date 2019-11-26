/* eslint-disable eqeqeq */

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    let { userId } = decodedToken;
    userId = parseInt(userId, 10);
    let reqId = req.body.userId || req.params.userId;
    reqId = parseInt(reqId, 10);
    if (Number.isNaN(userId) || (reqId && reqId !== userId)) {
      throw new Error('Invalid user ID');
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: `Unauthorized request, ${error} ` });
  }
};
