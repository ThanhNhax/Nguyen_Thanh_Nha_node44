import sequelize from '../models/connect.js';
import initModels from '../models/init-models.js';
import { STATUS_CODE } from '../utils/constant.js';

const model = initModels(sequelize);

const getUsers = async (req, res) => {
  try {
    const data = await model.users.findAll();
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

export { getUsers };
