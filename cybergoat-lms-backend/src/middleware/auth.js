import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('CRITICAL ERROR: JWT_SECRET environment variable is missing.');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
}
