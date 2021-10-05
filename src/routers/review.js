const express = require('express')
const router = new express.Router()
const Topic = require('../models/topic')
const Review = require('../models/review')
const multer = require('multer')
const upload = multer()
const { Op } = require('sequelize')
const fs = require('fs')
const sequelize = require('../db/sequelize')
router.post('/add', async (req, res) => {
    try {
        await Review.create(req.body)
        res.send({ result: 'Review has been created' })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
router.post('/file/upload/:id', upload.single('image'), async (req, res) => {
    if (req.file == undefined) {
        return res.send(`You must select a file.`);
    }
    // try{
    // const reviewId = req.params.id
    // const reviewImageFile = Buffer.from(req.file.buffer).toString('base64')
    // const imageFile = fs.readFileSync(reviewImageFile);

    // const encode_image = imageFile.toString('base64');
    // const reviewImage = {
    //     // contentType: req.file.mimetype,
    //     reviewImage: Buffer.isEncoding(encode_image, 'base64')
    //  };
    // const uploadFile = await Review.update({reviewImage},{
    //     where:{
    //         reviewId
    //     }
    // })
    // console.log(req.file)
    res.send(req.file)
    // }catch(error){
    //     res.status(500).send({error:error.message})

    // }
})

router.get('/image/:id', async (req, res) => {
    // try {
    const id = req.params.id

    const image = await Review.findOne({ where: { reviewId: id } })

    reader.readAsArrayBuffer()
    if (image) {
        // res.set('Content-Type', image.reviewImage.mimetype)
        res.send(image)
    } else {
        res.send('No image with that id!')
    }
    // } catch (error) {
    //     res.status(500).send({error:error.message})
    // }
});

router.get('/getAll', async (req, res) => {
    try {
        //ค้นหาตามชื่อ topic
        req.query.searchTopic = !req.query.searchTopic ? '' : req.query.searchTopic
        //เลขหน้า
        const offset = parseInt(req.query.page) * parseInt(req.query.pageSize);
        //ลิมิตของไอเทม
        const limit = parseInt(req.query.pageSize);
        //เรียงข้อมูล โดยดั้งเดิมเป็น topicName
        const sortBy = !req.query.sortBy ? 'topicName' : req.query.sortBy
        //เรียงลำดับจากมากไปน้อย หรือ น้อยไปมาก
        const sortDesc = req.query.sortDesc == 'true' ? 'DESC' : 'ASC'
        //ใช้เพื่อค้นหาคำใน Review
        !req.query.searchWord ? '' : req.query.searchWord
//ตัวอย่าง
//search=&page=0&pageSize=5&sortBy=topicName&searchWord=search&sortDesc=false

        const reviewSortByTopic = await Topic.findAll({
            attributes: { exclude: ['topicId'] },
            include:{
                model:Review
            },
            where: {
                topicName: {
                    [Op.substring]: req.query.searchTopic
                },
            },
            order: [
                [sortBy, sortDesc]
            ],
            limit,
            offset
        })
        const searchReview = await Review.findAll({
            where: {
                [Op.or]: [{
                    reviewTitle:{
                        [Op.substring]: req.query.searchWord
                    }
                },{
                    reviewContent:{
                        [Op.substring]: req.query.searchWord
                    }
                },{
                    reviewer:{
                        [Op.substring]: req.query.searchWord
                    }  
                }]

            },
            limit,
            offset
        })

        if (!req.query.searchWord) {
            res.send(reviewSortByTopic)
        }else{
            res.send(searchReview)
        }
        
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
router.get('/get/:id', async (req, res) => {
    const id = req.params.id
    try {
        const review = await Review.findOne({
            attributes: { exclude: ['topicId'] },
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
        res.status(500).send({ error: error.message })
    }
})

router.put('/edit/:id', async (req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['reviewTitle', 'reviewContent', 'reviewLink', 'reviewer', 'topicId']
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
        res.status(500).send({ error: error.message })
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
        res.status(500).send({ error: error.message })
    }
})

router.get('/hotReview', async (req, res) => {
    try {
        const maxReview = await Review.findAll({
            attributes: [[sequelize.fn('max', sequelize.col('topicId')), 'maxTopicId',]],
            raw: true
        })
        const id = maxReview.map(value => Object.values(value)[0])
        console.log(id)
        const hotReview = await Topic.findOne({
            where: {
                topicId: id
            }
        })
        res.send(hotReview)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router