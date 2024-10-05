import sequelize from '../models/connect.js';
import initModels from '../models/init-models.js';
import restaurants from '../models/restaurants.js';
import users from '../models/users.js';
import { Op, Sequelize } from 'sequelize';
import { STATUS_CODE } from '../utils/constant.js';

const model = initModels(sequelize);

const createReviews = async (req, res) => {
  const { res_id, user_id, amount } = req.body;
  // Kiểm tra data cho null hay không
  if (!res_id) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `res_id is empty` });
  }

  if (!user_id) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `userId is empty` });
  }

  if (!amount) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: `amount is empty` });
  }
  try {
    const newReview = await model.rate_res.create({
      res_id,
      user_id,
      amount,
    });

    return res
      .status(STATUS_CODE.CREATE)
      .json({ message: 'Create successfully.', review: newReview });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error });
  }
};

const getReviews = async (req, res) => {
  const { restaurantId, userId } = req.query;

  try {
    const whereCondition = {};

    if (userId) {
      whereCondition.user_id = userId;
    }

    if (restaurantId) {
      whereCondition.res_id = restaurantId;
    }

    const reviews = await model.rate_res.findAll({
      where: whereCondition,
      include: [
        {
          model: restaurants,
          as: 're',
        },
        {
          model: users,
          as: 'user',
        },
      ],
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách đánh giá' });
  }
};

export { getReviews, createReviews };
