const express = require('express')

const router = new express.Router()
const Semester = require('../models/semester')

router.get('/getall',async (req,res)=>{
    try{
        const semesters = await Semester.findAll()
        res.status(200).send({semesters})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

module.exports = router