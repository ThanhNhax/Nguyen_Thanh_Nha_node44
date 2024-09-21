import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
import { Op } from 'sequelize';

import e from 'express';
// import pool from '../database/index.js';
import { STATUS_CODE } from '../utils/constant.js';

const model = initModels(sequelize);

const getUser = async (req, res) => {
  const { full_name = '' } = req.query;
  try {
    // const [data] = await pool.query(`SELECT * FROM users LIMIT 10`);
    //return res.status(200).json(data);
    let data = await model.users.findAll({
      where: {
        // full_name: 'John Doe',
        full_name: {
          [Op.like]: `%${full_name}%`,
        },
      },
      include: [{ model: model.video, as: 'videos' }],
    });

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

const createUser = async (req, res) => {
  const { full_name, email, pass_word } = req.body;
  console.log({ full_name, email, pass_word });
  try {
    // const [data] = await pool.query(
    //   `INSERT INTO user_express(full_name,email,pass_word) values ("${full_name}", "${email}","${pass_word}")`
    // );
    let newUser = await model.users.create({ full_name, email, pass_word });
    return res.status(STATUS_CODE.CREATE).json(newUser);
  } catch (e) {
    return res.status(STATUS_CODE.INTERNAL_SERVER).json(e);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // const [idDelete] = await pool.query(`
    //     SELECT user_express_id FROM user_express
    //     WHERE user_express_id =${id}`);
    // console.log({ idDelete });
    // if (idDelete.length) {
    //   const [data] = await pool.query(
    //     `DELETE FROM user_express WHERE user_express_id = ${idDelete[0].user_express_id}`
    //   );
    const user = await model.users.findByPk(id);
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    user.destroy();
    return res
      .status(STATUS_CODE.OK)
      .json({ message: 'User deleted successfully' });
  } catch (e) {
    return res.status(STATUS_CODE.INTERNAL_SERVER).json({ e });
  }
};

export { getUser, createUser, deleteUser };
