const express = require('express')
const router = new express.Router()
const Topic = require('../models/topic')
router.get('/getAll',async(req,res)=>{
    try {
        const topic = await Topic.findAll()
        if(!topic){
            res.send('Item not found!')
        }
        res.send(topic)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router