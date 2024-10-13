import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
import { STATUS_CODE } from '../utils/constant.js';
import { PrismaClient } from '@prisma/client';

const model = initModels(sequelize); //Sequelize

const prisma = new PrismaClient();
const getAllVideos = async (req, res) => {
  try {
    // const data = await model.video.findAll();
    const data = await prisma.video.findMany();
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await model.video.findOne({ video_id: id });
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const getAllVideoTypes = async (req, res) => {
  try {
    const data = await model.video_type.findAll();
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const getListVideoType = async (req, res) => {
  try {
    let { id } = req.params;
    console.log({ id });
    let data = await model.video.findAll({
      where: { type_id: id },
    });
    return res.status(STATUS_CODE.OK).json(data);
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const getVideoPage = async (req, res) => {
  try {
    let { page, size } = req.params;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ messasge: 'page is wrong' });
    }
    if (isNaN(size) || size <= 0) {
      return res.status(400).json({ messasge: 'size is wrong' });
    }
    let index = (page - 1) * size;
    // let data = await model.video.findAll({
    //   offset: index,
    //   limit: size,
    // });
    const data = prisma.video.findMany({
      skip: index,
      take: size,
    });
    const pagination = {
      total: await model.video.count(),
      page: 1,
      limit: size,
    };
    return res.status(STATUS_CODE.OK).json({ data, pagination });
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

export {
  getAllVideos,
  getAllVideoTypes,
  getVideoById,
  getListVideoType,
  getVideoPage,
};
