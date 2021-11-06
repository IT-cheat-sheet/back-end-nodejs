const express = require('express')

const router = new express.Router()
const Semester = require('../models/semester')

router.get('/getall',async (req,res)=>{
    try{
        const semesters = await Semester.findAll({
            order:[
                ['semesterNumber','ASC']
            ]
        })
        res.status(200).send({semesters})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.get('/get/:semesterNumber',async (req,res)=>{
    try{
        const semesterNumber = req.params.semesterNumber
        const semester = Semester.findOne({
            where:{
                semesterNumber
            }
        })
        if(!semester){
            return res.status(400).send({error:'semester not found!'})
        }
        res.status(200).send({semester})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.post('/create',async (req,res)=>{
    try{
        const newSemester = await Semester.create(req.body)
        res.status(200).send({status:'create successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.put('/edit/:semesterNumber',async (req,res)=>{
    try{
        const semesterNumber = req.params.semesterNumber
        const updates = Object.keys(req.body)
        const allowedUpdates = ['semesterNumber','semester']
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
        if(!isValidOperation){
            return res.status(400).send({ error:'Invalid updates!'})
        }
        const updatedSemester = Semester.update(req.body,{
            where:{
                semesterNumber
            }
        })
        if(updatedSemester[0] === 0){
            return res.status(400).send({error:'semester not found or noting change in semesters!'})
        }
        res.status(200).send({status:'update successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.delete('/delete/:semesterNumber',async (req,res)=>{
    try{
        const semesterNumber = req.params.semesterNumber
        const deletedSemester = await Semester.destroy({
            where:{
                semesterNumber
            }
        })
        if(deletedSemester === 0){
            return res.status(402).send({error:'semester not found or noting delete in semesters!'})
        }
        res.status(200).send({status:'delete successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

module.exports = router