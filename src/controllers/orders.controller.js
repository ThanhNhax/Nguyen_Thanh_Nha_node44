import sequelize from '../models/connect.js';
import initModels from '../models/init-models.js';
import { STATUS_CODE } from '../utils/constant.js';

const model = initModels(sequelize);

const getOrder = async (req, res) => {
  try {
    const data = await model.orders.findAll();
    return res.status(STATUS_CODE.OK).json({ data });
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const createOrder = async (req, res) => {
  const { user_id, food_id, amount } = req.body;
  // Kiểm tra data cho null hay không
  if (!user_id) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `user_id is empty` });
  }
  if (!food_id) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `food_id is empty` });
  }
  if (!amount) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `amount is empty` });
  }
  try {
    const data = await model.orders.create({ user_id, food_id, amount });
    return res
      .status(STATUS_CODE.CREATE)
      .json({ message: 'Create successfully.' });
  } catch (e) {
    return res.status(STATUS_CODE.INTERNAL_SERVER).json({ message: e });
  }
};

export { getOrder, createOrder };
