const { DataTypes } = require('sequelize')
const sequelize = require('../db/sequelize')
const Topic = require('./topic')
const Review = sequelize.define('reviews',{
    reviewId: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(7).ZEROFILL.UNSIGNED,
        validate:{
            min: 0,
            max: 9999999
        },
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
    reviewLink: {
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

Topic.hasMany(Review,{foreignKey: 'topicId'})
Review.belongsTo(Topic, { foreignKey: 'topicId' })
module.exports = Review