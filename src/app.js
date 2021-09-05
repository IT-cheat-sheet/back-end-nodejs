const express = require('express')
const subjectRouter = require('./routers/subject')
const semesterRouter = require('./routers/semester')
const summarypostRouter = require('./routers/summarypost')

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use('/subject',subjectRouter)
app.use('/semester',semesterRouter)
app.use('/summarypost',summarypostRouter)

app.get('/health',(req,res)=>{
    res.send({status:'This service is healthy.'})
})

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})