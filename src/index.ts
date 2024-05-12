import express from 'express'
import fileUpload from 'express-fileupload'
import { getFileURL, uploadFile, getFiles } from './s3'
import cors  from 'cors'
import path from 'path';
// import mysql from 'mysql2'

const port = process.env.PORT || 3001;
const app = express();

app.use(fileUpload({
    useTempFiles: false,
    // tempFileDir: './uploads'
}))

// const corsOptions = {
//     origin: '*',
//     credentilals: true,
//     optionSuccessStatus: 200
// }

app.use(cors()) 
app.use(function (req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST")
    next()
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.post('/files', async (req, res, next) => {
    const result = await uploadFile(req.files!.file)
    res.json({ result })
})

app.get('/files', async (req, res, next) => {
    const result = await getFiles()
    res.json(result.Contents)
})

app.get('/files/:filename', async (req, res, next) => {
    const separateFilename = req.params.filename.split(".")
    let result = await getFileURL(req.params.filename)
    res.json({ result })
})

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log("the server is running")
})
