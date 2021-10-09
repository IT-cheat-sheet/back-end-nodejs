const {DataTypes} = require('sequelize')
const sequelize = require('../db/sequelize')

const Topic = sequelize.define('topics',{
    topicId: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(2).ZEROFILL.UNSIGNED,
        validate:{
            min: 0,
            max: 99
        },
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