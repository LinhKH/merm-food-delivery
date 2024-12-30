import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Token invalid' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the req object
    req.user = {
      userId: payload.id
    };

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication invalid' });
  }
}