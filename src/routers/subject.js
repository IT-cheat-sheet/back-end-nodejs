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

router.get('/get/:subjectNumber',async (req,res)=>{
    try{
        const subjectNumber = req.params.subjectNumber
        const subject = await Subject.findOne({
            where:{
                subjectNumber
            }
        })
        if(!subject){
            return res.status(400).send({error:'subject not found!'})
        }
        res.status(200).send({subject})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.post('/create',async (req,res)=>{
    try{
        const newSubject = await Subject.create(req.body)
        res.status(200).send({status:'create successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.put('/edit/:subjectNumber',async (req,res)=>{
    try{
        const subjectNumber = req.params.subjectNumber
        const updates = Object.keys(req.body)
        const allowedUpdates = ['subjectNumber','subjectId','subjectName']
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
        if(!isValidOperation){
            return res.status(400).send({ error:'Invalid updates!'})
        }
        const updatedSubject = await Subject.update(req.body,{
            where:{
                subjectNumber
            }
        })
        if(updatedSubject[0] === 0){
            return res.status(400).send({error:'subject not found or noting change in subjects!'})
        }
        res.status(200).send({status:'update successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.delete('/delete/:subjectNumber',async (req,res)=>{
    try{
        const subjectNumber = req.params.subjectNumber
        const deletedSubject = await Subject.destroy({
            where:{
            subjectNumber
            }
        })
        if(deletedSubject === 0){
            return res.status(400).send({error:'subject not found or noting delete in subjects!'})
        }
        res.status(200).send({status:'delete successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

module.exports = router