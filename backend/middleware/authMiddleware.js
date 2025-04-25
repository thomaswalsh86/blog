const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ error: 'Access denied, no token provided in middleware' });

  try {
    const decoded = jwt.verify(token, process.env.SUPA);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken };