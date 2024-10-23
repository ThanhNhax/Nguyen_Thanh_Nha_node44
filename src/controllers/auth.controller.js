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
import transporter from '../config/transporter.js';
import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';

const prisma = new PrismaClient();
const hashPassword = (pass) => bcrypt.hashSync(pass, 10);

const comparePassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);

const login = async (req, res) => {
  let { email, pass, code } = req.body;
  console.log({ email, pass, code });
  // Hàm tiện ích để kiểm tra đầu vào
  const validateInput = (input, message) => {
    if (!input.trim()) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message });
    }
  };

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  try {
    validateInput(email, 'Email không được rỗng.');
    validateInput(pass, 'Password không được rỗng.');

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email không đúng định dạng.' });
    }

    // Kiểm tra độ dài mật khẩu
    if (pass.length < 6) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    let user = await prisma.users.findFirst({
      where: { email },
    });

    // Kiểm tra xem người dùng có tồn tại
    if (!user) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email không đúng' });
    }

    const { pass_word, refresh_token, ...rest } = user;

    // Kiểm tra mật khẩu
    const isPasswordValid = comparePassword(pass, pass_word);
    if (!isPasswordValid) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Mật khẩu không đúng' });
    }
    console.log({ user });
    // check code được nhập từ request:
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: code, //laấy từ google authenticator
    });

    console.log({ verified });
    if (!verified) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Invalid 2FA' });
    }

    // Tạo token
    const payload = { userId: user.user_id };
    const accessToken = createToken(payload);
    const refreshToken = createRefToken(payload);

    await modal.users.update(
      { refresh_token: refreshToken },
      { where: { user_id: user.user_id } }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.status(STATUS_CODE.OK).json({
      data: { accessToken, user: rest },
      message: 'Đăng nhập thành công.',
    });
  } catch (e) {
    console.log({ e });
    return res
      .status(STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const register = async (req, res) => {
  let { fullName, email, pass } = req.body;
  try {
    // check email
    const isEmail = await prisma.users.findFirst({
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
    }
    //tạo secret QRCode
    const secret = speakeasy.generateSecret({ length: 15 });

    const newUser = await prisma.users.create({
      data: {
        full_name: fullName,
        email,
        pass_word: hashPassword(pass),
        secret: secret.base32,
      },
    });
    //cấu hình info email
    const mailOption = {
      from: 'configEmail.user',
      to: email,
      subject: 'Welcome to Our service',
      text: `Hello ${fullName}. Best Regards.`,
    };
    transporter.sendMail(mailOption, async (err, info) => {
      if (err) {
        return res.status(STATUS_CODE.INTERNAL_SERVER).json({ message: err });
      }

      return res
        .status(STATUS_CODE.OK)
        .json({ message: 'Đăng ký thành công', data: newUser });
    });
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
  // lấy refresh token từ cookie request
  const refreshToken = req.cookies.refreshToken;
  console.log({ refreshToken });
  if (!refreshToken) {
    return res.status(400).json({ mesage: 'không có refreshToken ở cookie' });
  }

  const checkRefToken = await modal.users.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  console.log({ checkRefToken });
  if (!checkRefToken) {
    return res.status(400).json({ mesage: 'không có refreshToken ở DB' });
  }

  const newToken = createToken({ userId: checkRefToken.user_id });
  // tạo access token mới
  // const newToken = createTokenAsyncKey({ userId: checkRefToken.user_id });
  return res.status(200).json({ message: 'Success', data: newToken });
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
    transporter.sendMail(mailOption, (err, info) => {
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
