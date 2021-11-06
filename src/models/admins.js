const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Admins = sequelize.define("admins", {
  adminId: {
    type: DataTypes.INTEGER(10).UNSIGNED.ZEROFILL,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: "username_UNIQUE",
  },
  password: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

module.exports = Admins;
