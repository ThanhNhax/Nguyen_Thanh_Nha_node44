import { verifyToken } from '../config/jwt.js';
import { STATUS_CODE } from '../utils/constant.js';

export const middleWaretoken = (req, res, next) => {
  let { authorization } = req.headers;
  const token = authorization.split(' ')[1]; //   let checktoken = jwt.verify(token, 'NODE44');

  const checkToken = verifyToken(token);
  console.log({ checkToken });
  if (checkToken.error)
    return res.status(STATUS_CODE.UNAUTHORIZED).json(checkToken.error);
  next();
};
