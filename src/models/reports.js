const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const SummaryPost = require('../models/summarypost')
const Review  = require('../models/review')

const Report = sequelize.define('reports',{
    reportNumber:{
        type: DataTypes.INTEGER(7),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    reportAction:{
        type: DataTypes.ENUM('Edit','Delete'),
        allowNull: false
    },
    reportDescription:{
        type: DataTypes.STRING(5000),
        allowNull: false
    },
    readStatus:{
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    }
})

Report.belongsTo(SummaryPost,{foreignKey:'summaryPostId',allowNull:true, as:'summarypost'})
Report.belongsTo(Review,{foreignKey:'reviewId',allowNull:true})

module.exports = Report