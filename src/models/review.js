const { DataTypes } = require('sequelize')
const sequelize = require('../db/sequelize')
const Topic = require('./topic')
const Review = sequelize.define('reviews',{
    reviewId: {
        primaryKey: true,
        type: DataTypes.INTEGER(7).ZEROFILL.UNSIGNED,
        allowNull: false
    },
    reviewTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    reviewContent: {
        type: DataTypes.STRING(5000),
        allowNull: false,
    },
    //review Not reivew
    reivewLink: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    reviewImage: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    reviewer: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

}, {
    timestamps: false
})


Review.belongsTo(Topic, { foreignKey: 'topicId' })
module.exports = Review