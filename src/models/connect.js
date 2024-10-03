import Sequelize from 'sequelize';
import connectDB from '../config/connect_db.js';

const sequelize = new Sequelize(
  connectDB.database,
  connectDB.user,
  connectDB.pass,
  {
    dialect: connectDB.dialect,
    host: connectDB.host,
    port: connectDB.port,
  }
);

export default sequelize;
