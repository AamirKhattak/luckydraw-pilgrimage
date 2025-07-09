// backend/middleware/verifySecret.js
require('dotenv').config();

module.exports = function verifySecret(req, res, next) {
  const provided = req.headers['x-admin-secret'];
  const expected = process.env.ADMIN_SECRET;

  console.log('Provided secret:', provided);
  console.log('Expected secret:', expected);  
  
  if (!provided || provided !== expected) {
    return res.status(403).json({ error: 'Forbidden: invalid or missing admin secret.' });
  }

  next();
};
