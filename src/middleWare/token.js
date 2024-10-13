import { join } from '@prisma/client/runtime/library';
import { verifyToken } from '../config/jwt.js';
import { STATUS_CODE } from '../utils/constant.js';

export const middleWretoken = (req, res, next) => {
  try {
    let { token } = req.headers;
    if (!token) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ message: 'khong có token' });
    }

    const checkToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log({ checkToken });
    if (checkToken.error)
      return res.status(STATUS_CODE.UNAUTHORIZED).json(checkToken.error);
    next();
  } catch (e) {
    res.status(STATUS_CODE.UNAUTHORIZED).json(e);
  }
};

export const middleWareToken = (req, res, next) => {
  let { token } = req.headers;
  let checkToken = verifyToken(token);
  if (checkToken) {
    // nếu token hợp lệ => pass => qua router
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
