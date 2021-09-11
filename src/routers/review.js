const express = require('express')
const router = new express.Router()
const Topic = require('../models/topic')
const Review = require('../models/review')
const multer = require('multer')
const upload = multer()
const fs = require('fs')
router.post('/add', async (req, res) => {
    try {
        await Review.create(req.body)
        res.send('Review has been created')
    } catch (error) {
        res.status(500).send(error)
    }
})
router.post('/file/upload/:id', upload.single('image'), async(req,res)=>{
    
    if (req.file == undefined) {
        return res.send(`You must select a file.`);
    }
    try{
        const reviewImage = Buffer.from(req.file.buffer).toString('base64')
        const reviewId = req.params.id
        const uploadFile = await Review.update({reviewImage},{
            where:{
                reviewId
            }
        })
        console.log(req.file)
        res.send('File uploaded.')
    }catch(error){
        res.status(500).send(error)

    }
})

router.get('/image/:id', async (req, res) => {
    try {
        const id = req.params.id
        const image = await Review.findOne({ where: { reviewId: id } })
        const reader = await FileReader(image.reviewImage)
        console.log(image.reviewImage)
        reader.readAsArrayBuffer()
        if (image) {
            // res.set('Content-Type', image.reviewImage.mimetype)
            res.send(image)
        } else {
            res.send('No image with that id!')
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/getAll', async (req, res) => {
    try {
        const review = await Review.findAll({
            include: {
                model: Topic
            }
        })
        if (!review) {
            res.send('Item not found!')
        }
        res.send(review)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/get/:id', async (req, res) => {
    const id = req.params.id
    try {
        const review = await Review.findOne({
            where: {
                reviewID: id
            },
            include: {
                model: Topic
            }
        })
        if (!review) {
            res.send('Item not found!')
        }
        res.send(review)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/edit/:id', async (req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['reviewTitle', 'reviewContent', 'reviewLink', 'reviewer','topicId']
    const validKey = checkKeyBody.every((checkKeyBody) => {
        return allowedKey.includes(checkKeyBody)
    })
    if (!validKey) {
        return res.status(400).send('Invalid key!')
    }
    const id = req.params.id
    try {
        await Review.update(req.body, {
            where: {
                reviewID: id
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
        const reviewDelete = await Review.destroy({
            where: {
                reviewID: id
            }
        })
            res.send('Item has been deleted')
        if (!reviewDelete) {
            res.status(400).send("Item can't delete with that Id!")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router