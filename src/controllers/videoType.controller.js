import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
import { STATUS_CODE } from '../utils/constant.js';
import { PrismaClient } from '@prisma/client';

const model = initModels(sequelize);

const prisma = new PrismaClient();
const getAllVideoType = async (req, res) => {
  try {
    // const data = await model.video_type.findAll();
    const data = await prisma.video_type.findMany();
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    console.log({ e });
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const getListVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    // const data = await model.video.findAll({
    //   where: {
    //     type_id: id,
    //   },
    // });
    const data = prisma.video.findMany({
      where: {
        type_id: +id,
      },
    });
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

export { getAllVideoType, getListVideoById };
