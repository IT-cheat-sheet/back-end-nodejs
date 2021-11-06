const {DataTypes} = require('sequelize')
const sequelize = require('../db/sequelize')

const Semester = sequelize.define('semesters',{
    semesterNumber:{
        type: DataTypes.INTEGER(2).UNSIGNED.ZEROFILL,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    semester:{
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: 'semester_UNIQUE'
    }
})

module.exports = Semester