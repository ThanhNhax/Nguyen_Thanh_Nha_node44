import initModels from '../models/init-models.js';
import sequelize from '../models/connect.js';
const modal = initModels(sequelize);
import { STATUS_CODE } from '../utils/constant.js';
import bcrypt from 'bcrypt';
import {
  createRefToken,
  createRefTokenAsyncKey,
  createToken,
  createTokenAsyncKey,
} from '../config/jwt.js';
import transproter, { configEmail } from '../config/transporter.js';
import crypto from 'crypto';
import { where } from 'sequelize';

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
    const refreshToken = createRefToken(payload);

    await modal.users.update(
      { refresh_token: refreshToken },
      { where: { user_id: data.user_id } }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian tồn tại của Cookie trong miligiây
    });

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

const extendToken = async (req, res) => {
  try {
    // lấy  refresh token từ cookie request
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(STATUS_CODE.UNAUTHORIZED);

    const checkRefreshToken = await modal.users.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!checkRefreshToken) return res.status(STATUS_CODE.UNAUTHORIZED);

    const newToken = createToken({ userId: checkRefreshToken.user_id });
    return res
      .status(STATUS_CODE.OK)
      .json({ message: 'Success', data: newToken });
  } catch (e) {
    return res.status(STATUS_CODE.INTERNAL_SERVER).json(e);
  }
};

const loginAsyncKey = async (req, res) => {
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
    const accessToken = createTokenAsyncKey(payload);
    const refreshToken = createRefTokenAsyncKey(payload);

    await modal.users.update(
      { refresh_token: refreshToken },
      { where: { user_id: data.user_id } }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian tồn tại của Cookie trong miligiây
    });

    return res.status(STATUS_CODE.OK).json({
      data: { accessToken, user: rest },
      message: 'Login successfully.',
    });
  } catch (e) {
    return res.status(STATUS_CODE.INTERNAL_SERVER).json({ message: e });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req?.body;

  try {
    if (!email) {
      throw new Error('Email is wrong');
    }
    let checkEmail = await modal.users.findOne({
      where: {
        email,
      },
    });
    if (!checkEmail) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email not found' });
      return;
    }
    // tạo code
    const ramdomCode = crypto.randomBytes(5).toString('hex');

    //Tạo biến lưu expired code
    const expired = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
    // lưu code vào database
    await modal.code.create({
      code: ramdomCode,
      expired,
    });

    //send email
    //cấu hình info email
    const mailOption = {
      from: 'configEmail.user',
      to: email,
      subject: 'Mã xác thực',
      text: `Hệ thống gửi bạn mã code fotgot password`,
      html: `<h1>${ramdomCode}</h1>`,
    };
    transproter.sendMail(mailOption, (err, info) => {
      if (err) {
        return res
          .status(STATUS_CODE.INTERNAL_SERVER)
          .json({ message: 'Send email error' });
      }
      return res
        .status(STATUS_CODE.OK)
        .json({ message: 'Please check your email.', statusCode: 200 });
    });
  } catch (error) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: error.message });
  }
};
const changePassword = async (req, res) => {
  const { code, newPassword, email } = req.body;
  try {
    const checkCode = await modal.code.findOne({
      where: {
        code,
      },
    });

    if (!checkCode) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Code is wrong.' });
    }

    //kiểm tra expired còn dài thời không
    // Thời gian hiện tại
    const currentTime = new Date();
    // So sánh thời điểm hết hạn với thời gian hiện tại
    if (currentTime.getTime() >= new Date(checkCode.expired)) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Code has expired.' });
    }
    // kiểm tra email có tồn tại trong DB không
    const checkEmail = await modal.users.findOne({
      where: {
        email,
      },
    });
    if (!checkEmail) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email is wrong.' });
    }

    //hash password
    const newHashPassword = hashPassword(newPassword);

    // update password
    checkEmail.pass_word = newHashPassword;
    checkEmail.save();

    //remote code
    await modal.code.destroy({
      where: {
        code,
      },
    });

    return res
      .status(STATUS_CODE.OK)
      .json({ message: 'Change password successfully' });
  } catch (e) {
    console.log(e);
    return res.status(STATUS_CODE.INTERNAL_SERVER).json({ message: e });
  }
};

export {
  login,
  register,
  loginFacebook,
  extendToken,
  loginAsyncKey,
  forgotPassword,
  changePassword,
};
