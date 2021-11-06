const {DataTypes} = require('sequelize')
const sequelize = require('../db/sequelize')

const Subject = sequelize.define('subjects',{
    subjectNumber:{
        type: DataTypes.INTEGER(3).UNSIGNED.ZEROFILL,
        primaryKey: true,
        allowNull: false,
        autoIncrement:true
    },
    subjectId:{
        type: DataTypes.STRING(6),
        allowNull: false
    },
    subjectName:{
        type: DataTypes.STRING(100),
        allowNull: false
    }
})

module.exports = Subject