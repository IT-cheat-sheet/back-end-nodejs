const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const Admins = require("./admins");

const tokenAdmins = sequelize.define("tokensadmin", {
  tokenId: {
    type: DataTypes.INTEGER(10).UNSIGNED.ZEROFILL,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

tokenAdmins.belongsTo(Admins, { foreignKey: "adminId" });
module.exports = tokenAdmins;
