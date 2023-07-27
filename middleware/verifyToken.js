const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({
      status: 401,
      message: 'unauthorized',
    })
  }
  jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        message: 'forbidden',
      })
    }
    req.email = decoded.email;
    next();
  })
}

module.exports = VerifyToken