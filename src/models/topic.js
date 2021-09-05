const {DataTypes} = require('sequelize')
const sequelize = require('../db/sequelize')

const Topic = sequelize.define('topics',{
    topicId: {
        primaryKey: true,
        type: DataTypes.INTEGER(2).ZEROFILL.UNSIGNED,
        allowNull: false
    },
    topicName: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
},{
    timestamps: false
})


module.exports = Topic