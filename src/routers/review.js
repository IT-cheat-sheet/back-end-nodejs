const express = require('express')
const router = new express.Router()
const Topic = require('../models/topic')
const Review = require('../models/review')
router.get('/getAll',async(req,res)=>{
    try {
        const review = await Review.findAll({
            include:{
                model: Topic
            }
        })
        if(!review ){
            res.send('Item not found!')
        }
        res.send(review)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router