import sequelize from '../models/connect.js';
import initModels from '../models/init-models.js';
import restaurants from '../models/restaurants.js';
import users from '../models/users.js';
import { Op, Sequelize } from 'sequelize';
import { STATUS_CODE } from '../utils/constant.js';

const model = initModels(sequelize);

const getLikes = async (req, res) => {
  const { user_id, res_id } = req.query;

  try {
    const whereCondition = {};

    if (user_id) {
      whereCondition.user_id = user_id;
    }

    if (res_id) {
      whereCondition.res_id = res_id;
    }

    const data = await model.like_res.findAll({
      where: whereCondition,
      include: [
        {
          model: restaurants,
          as: 'restaurant',
        },
        {
          model: users,
          as: 'user',
        },
      ],
    });

    return res.status(STATUS_CODE.OK).json({ data });
    // return res.status(STATUS_CODE.OK).json({ data: { count, rows } });
  } catch (e) {
    console.log({ e });
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const likeRestaurant = async (req, res) => {
  const { res_id, user_id } = req.body;
  // Kiểm tra data cho null hay không
  if (!res_id) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `res_id is empty` });
  }
  if (!user_id) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `user_id is empty` });
  }
  try {
    // Kiểm tra xem like đã tồn tại chưa
    const existingLike = await model.like_res.findOne({
      where: {
        res_id,
        user_id,
      },
    });

    if (existingLike) {
      // Unlike nếu like đã tồn tại
      await existingLike.destroy();
      res.status(STATUS_CODE.CREATE).json({ message: 'Unlike thành công' });
    } else {
      // Like nếu chưa tồn tại
      await model.like_res.create({
        res_id,
        user_id,
      });

      res.status(STATUS_CODE.CREATE).json({ message: 'Like thành công' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(STATUS_CODE.INTERNAL_SERVER).json({ error: 'Đã xảy ra lỗi' });
  }
};

export { getLikes, likeRestaurant };
