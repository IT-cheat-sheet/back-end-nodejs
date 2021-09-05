const express = require('express')

const router = new express.Router()
const SummaryPost = require('../models/summarypost')
const Semester = require('../models/semester')
const Subject = require('../models/subject')

router.get('/getall',async (req,res)=>{
    try{
        const summaryPosts = await SummaryPost.findAll({
            include:[Semester,Subject]
        })
        res.status(200).send({summaryPosts})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

module.exports = router