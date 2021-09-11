const express = require('express')
const router = new express.Router()
const Topic = require('../models/topic')

router.post('/add', async (req, res) => {
    try {
        await Topic.create(req.body)
        res.send('Topic has been created')
    } catch (error) {
        res.status(500).send(error)
    }
})

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

router.get('/get/:id', async (req, res) => {
    const id = req.params.id
    try {
        const topic = await Topic.findOne({
            where: {
                topicId: id
            }
        })
        if (!topic) {
            res.status(500).send('Item not found!')
        }
        res.send(topic)
    } catch (error) {
        res.status(500).send(error)
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
        return res.status(400).send('Invalid key!')
    }
    const id = req.params.id
    
        await Topic.update(req.body, {
            where: {
                topicId: id
            }
        })
        res.send('Edit success!')
    } catch (error) {
        res.status(500).send(error)
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
            res.send('Item has been deleted')
        if (!topicDelete) {
            res.status(400).send("Item can't delete with that Id!")
        }
    } catch (error) {
        res.status(500).send(error)
    }
}) 
module.exports = router