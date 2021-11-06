const {DataTypes} = require('sequelize')
const sequelize = require('../db/sequelize')

const Subject = require('./subject')
const Semester = require('./semester')

const SummaryPost = sequelize.define('summarypost',{
    summaryPostId:{
        type: DataTypes.INTEGER(7).UNSIGNED.ZEROFILL,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    summaryTitle:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    summaryContent:{
        type: DataTypes.STRING(5000)
    },
    posterName:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    blobFile:{
        type: DataTypes.BLOB('long')
    },
    linkAttachment:{
        type: DataTypes.STRING(500)
    }
})

SummaryPost.belongsTo(Subject,{foreignKey:'subjectNumber'})
SummaryPost.belongsTo(Semester,{foreignKey:'semesterNumber'})

module.exports = SummaryPost