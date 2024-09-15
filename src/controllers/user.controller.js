import e from 'express';
import pool from '../database/index.js';
import { STATUS_CODE } from '../utils/constant.js';

const getUser = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM users LIMIT 10`);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const createUser = async (req, res) => {
  const { full_name, email, pass_word } = req.body;
  console.log({ full_name, email, pass_word });
  try {
    const [data] = await pool.query(
      `INSERT INTO user_express(full_name,email,pass_word) values ("${full_name}", "${email}","${pass_word}")`
    );
    console.log({ data });
    res.status(STATUS_CODE.CREATE).json({ data });
  } catch (e) {
    res.status(STATUS_CODE.INTERNAL_SERVER).json(e);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [idDelete] = await pool.query(`
        SELECT user_express_id FROM user_express
        WHERE user_express_id =${id}`);
    console.log({ idDelete });
    if (idDelete.length) {
      const [data] = await pool.query(
        `DELETE FROM user_express WHERE user_express_id = ${idDelete[0].user_express_id}`
      );
      res.status(STATUS_CODE.OK).json({ data });
    } else {
      res
        .status(STATUS_CODE.INTERNAL_SERVER)
        .json({ message: 'khong tim thay id:' + id });
    }
  } catch (e) {
    res.status(STATUS_CODE.INTERNAL_SERVER).json({ e });
  }
};

export { getUser, createUser, deleteUser };
