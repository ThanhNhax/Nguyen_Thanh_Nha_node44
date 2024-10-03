import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
const modal = initModels(sequelize);
import { STATUS_CODE } from '../utils/constant.js';
import bcrypt from 'bcrypt';
import { createToken } from '../config/jwt.js';
import transproter, { configEmail } from '../config/transporter.js';

const hashPassword = (pass) => bcrypt.hashSync(pass, 10);

const comparePassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);

const login = async (req, res) => {
  let { email, pass } = req.body;

  try {
    if (!email.trim()) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email không được rỗng.' });
    }
    if (!pass.trim()) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Pass không được rỗng.' });
    }
    let data = await modal.users.findOne({
      where: {
        email: email,
      },
    });
    //  check user
    if (!data) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email is wrong' });
    }

    const { pass_word, ...rest } = data.dataValues;
    //check password
    const checkPass = comparePassword(pass, pass_word);
    if (!checkPass)
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Password is wrong' });

    /**
     * tạo token
     * param1
     */
    const payload = {
      userId: data.dataValues.user_id,
    };
    const accessToken = createToken(payload);
    return res.status(STATUS_CODE.OK).json({
      data: { accessToken, user: rest },
      message: 'Login successfully.',
    });
  } catch (e) {
    return res.status(STATUS_CODE.INTERNAL_SERVER).json({ message: e });
  }
};

const register = async (req, res) => {
  let { fullName, email, pass } = req.body;

  console.log({ hashPassword });
  try {
    console.log({ fullName, email, pass });
    // check email
    const isEmail = await modal.users.findOne({
      where: {
        email: email,
      },
    });
    if (!fullName.trim()) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'fullName không được rỗng.' });
    }
    if (!email.trim()) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email không được rỗng.' });
    }
    if (!pass.trim()) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Pass không được rỗng.' });
    }
    if (isEmail) {
      return res
        .status(STATUS_CODE.CONFLICT)
        .json({ message: 'Email đã tồn tại. Vui lòng chọn email khác.' });
    } else {
      const data = await modal.users.create({
        full_name: fullName,
        email,
        pass_word: hashPassword(pass),
      });
      //cấu hình info email
      const mailOption = {
        from: 'configEmail.user',
        to: email,
        subject: 'Welcome to Our service',
        text: `Hello ${fullName}. Best Regards.`,
      };
      transproter.sendMail(mailOption, (err, info) => {
        if (err) {
          return res.status(STATUS_CODE.INTERNAL_SERVER).json({ message: e });
        }
        const { pass_word, ...rest } = data.dataValues;
        return res
          .status(STATUS_CODE.OK)
          .json({ message: 'Đăng ký thành công', data: rest });
      });
    }
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

const loginFacebook = async (req, res) => {
  const { id, email, name, avatar } = req?.body;
  /**
   * b1 :  lấy id, email, name từ request
   * b2: check id (app_face_id)
   * B3.1: nếu không có id thì tạo user -> trả token cho fe
   * b3.2: có thì tạo token -> FE
   */
  try {
    let user = await modal.users.findOne({
      where: { face_app_id: id },
    });
    console.log({ user });
    if (!user) {
      const newUser = {
        full_name: name,
        face_app_id: id,
        email,
        avatar,
      };
      user = await modal.users.create(newUser);
    }
    const accessToken = createToken({ userId: user.user_id });
    return res.status(STATUS_CODE.OK).json({
      data: { accessToken, user },
      message: 'Login successfully.',
    });
  } catch (e) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Not Found' });
  }
};

export { login, register, loginFacebook };
