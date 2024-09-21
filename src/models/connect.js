import Sequelize from 'sequelize';

const sequelize = new Sequelize('node44-youtobe', 'root', '123456', {
  dialect: 'mysql',
  host: 'localhost',
  port: '3306',
});

export default sequelize;
