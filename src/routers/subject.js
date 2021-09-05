const express = require('express')

const router = new express.Router()
const Subject = require('../models/subject')

router.get('/getall',async (req,res)=>{
    try{
        const subjects = await Subject.findAll()
        res.status(200).send({subjects})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

module.exports = router