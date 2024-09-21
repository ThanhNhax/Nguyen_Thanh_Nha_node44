import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
import { STATUS_CODE } from '../utils/constant.js';

const model = initModels(sequelize);

const getAllVideos = async (req, res) => {
  try {
    const data = await model.video.findAll();
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

export { getAllVideos };
