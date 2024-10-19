import { join } from '@prisma/client/runtime/library';
import { verifyToken } from '../config/jwt.js';
import { STATUS_CODE } from '../utils/constant.js';

export const middlewareToken = (req, res, next) => {
  let { token } = req.headers;
  let checkToken = verifyToken(token);
  if (checkToken) {
    // nếu token hợp lệ => pass => qua router
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
