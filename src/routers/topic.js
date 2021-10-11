const express = require('express')
const router = new express.Router()
const Topic = require('../models/topic')

router.post('/add', async (req, res) => {
    try {
        await Topic.create(req.body)
        res.send({message:'Topic has been created'})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})

router.get('/getAll',async(req,res)=>{
    try {
        const topic = await Topic.findAll()
        if(!topic){
            res.status(400).send({message:'Item not found!'})
        }
        res.status(200).send({data:topic})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})

router.get('/get/:id', async (req, res) => {
    const id = req.params.id
    try {
        const topic = await Topic.findOne({
            where: {
                topicId: id
            }
        })
        if (!topic) {
            res.status(400).send({message:'Item not found!'})
        }
        res.status(200).send({data:topic})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})

router.put('/edit/:id', async (req, res) => {
    try {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['topicName']
    const validKey = checkKeyBody.every((checkKeyBody) => {
        return allowedKey.includes(checkKeyBody)
    })
    if (!validKey) {
        return res.status(400).send({message:'Invalid key!'})
    }
    const id = req.params.id
    
        await Topic.update(req.body, {
            where: {
                topicId: id
            }
        })
        res.status(201).send({message:'Edit success!'})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})


router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    try {
        const topicDelete = await Topic.destroy({
            where: {
                topicId: id
            }
        })
            res.send({message:'Item has been deleted'})
        if (!topicDelete) {
            res.status(400).send({message:"Item can't delete with that Id!"})
        }
    } catch (error) {
        res.status(500).send({error:error.message})
    }
}) 
module.exports = router