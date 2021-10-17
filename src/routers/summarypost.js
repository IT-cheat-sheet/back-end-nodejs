const express = require('express')
const multer = require('multer')

const router = new express.Router()
const {Op} = require('sequelize')
const SummaryPost = require('../models/summarypost')
const Semester = require('../models/semester')
const Subject = require('../models/subject')

const upload = multer({
    limits:{
        fileSize: (1024*1024*24) //24MB
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpeg|jpg|JPG|JPEG|PNG|pdf|PDF)$/)){
            return cb(new Error());
        }
        cb(undefined,true);
    }
})

router.get('/getall',async (req,res)=>{
    try{
        req.query.semesterFilter = !req.query.semesterFilter ? Array.from(Array(await Semester.count()), (_, i) => i+1): parseInt(req.query.semesterFilter)
        req.query.pageNumber = !req.query.pageNumber ? 1 : req.query.pageNumber
        const sortby = [(req.query.sortBy ? req.query.sortBy : 'summaryPostId'),(req.query.sortType ? req.query.sortType: 'ASC')]
        const search = req.query.search ? req.query.search : ''
        const limit = parseInt(req.query.pageSize)
        const offset = limit * (parseInt(req.query.pageNumber)-1)
        const summaryPosts = await SummaryPost.findAndCountAll({
            where:{
                [Op.or]:[{
                    summaryTitle: {
                        [Op.substring]: search
                    }
                },{
                    summaryContent:{
                        [Op.substring]: search
                    }
                },{
                    posterName:{
                        [Op.substring]: search
                    }
                }]
            },
            attributes:{
                exclude:['blobFile','subjectNumber','semesterNumber']
            },
            include:[{
                model: Semester,
                where:{
                    semesterNumber: req.query.semesterFilter
                },
                order:[['semesterNumber','ASC']]
            },Subject],
            limit,
            offset,
            order: [sortby]
        })
        totalPage = Math.ceil(summaryPosts.count / limit)
        res.status(200).send({summaryPosts,totalPage})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.get('/get/:summaryPostId',async (req,res)=>{
    try{
        const summaryPostId = req.params.summaryPostId
        const summaryPost = await SummaryPost.findOne({
            where:{
                summaryPostId
            },
            attributes:{
                exclude:['blobFile','subjectNumber','semesterNumber']
            },
            include:[Semester,Subject]
        })
        if(!summaryPost){
            return res.status(400).send({error:'summaryPost not found!'})
        }
        res.status(200).send({summaryPost})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.get('/getFile/:summaryPostId',async (req,res)=>{
    try{
        const summaryPostId = req.params.summaryPostId
        const summaryPost = await SummaryPost.findOne({
            where:{
                summaryPostId
            }
        })
        if(!summaryPost){
            return res.status(404).send({error:'summaryPostId not found!'})
        }
        var rawfile = Buffer.from(summaryPost.blobFile, 'base64');
        const m = /^data:(.+?);base64,(.+)$/.exec(rawfile)
        if (!m) throw new Error()
        const [ _, content_type, file_base64 ] = m
        const file = Buffer.from(file_base64,'base64')
        res.set({
            'Content-Type': content_type,
            'Content-Length': file.length,
          })
        res.end(file)
    }catch(error){
        res.status(404).send({error:'File not found'})
    }
})

router.post('/create',async (req,res)=>{
    try{
        const newSummaryPost = await SummaryPost.create(req.body)
        res.status(200).send({status:'create successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.post('/upload/:summaryPostId',upload.single('file'),async (req,res)=>{
    try{
    const blobFile = 'data:'+req.file.mimetype+';base64,'+req.file.buffer.toString('base64')
    const summaryPostId = req.params.summaryPostId
    const uploadFile = await SummaryPost.update({blobFile},{
        where:{
            summaryPostId
        }
    })
    if(uploadFile[0] === 0){
        return res.status(400).send('Upload file Failed.')
    }
    res.status(200).send({status:'Upload file successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.put('/edit/:summaryPostId', async(req,res)=>{
    try{
        const summaryPostId = req.params.summaryPostId
        const updates = Object.keys(req.body)
        const allowedUpdates = ['semesterNumber','subjectNumber','summaryTitle','summaryContent','posterName','linkAttachment']
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
        if(!isValidOperation){
            return res.status(400).send({ error:'Invalid updates!'})
        }
        const updatedSummaryPost = await SummaryPost.update(req.body,{
            where:{
                summaryPostId
            }
        })
        if(updatedSummaryPost[0] === 0){
            return res.status(400).send({error:'summaryPost not found or noting change in summaryPosts!'})
        }
        res.status(200).send({status:'update successful !'})
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

router.delete('/delete/:summaryPostId',async (req,res)=>{
    try{
        const summaryPostId = req.params.summaryPostId
        const deletedSummaryPost = await SummaryPost.destroy({
            where:{
                summaryPostId
            }
        })
        if(deletedSummaryPost === 0){
            return res.status(400).send({error:'summaryPost not found or noting delete in summaryPosts!'})
        }
    }catch(error){
        res.status(500).send({error:error.message})
    }
})

module.exports = router