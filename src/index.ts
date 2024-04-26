import express from 'express'
import fileUpload from 'express-fileupload'
import { getFileURL, getPdfFileURL, getImageFileURL, uploadFile, getFiles } from './s3'
import cors  from 'cors'
import path from 'path';
// import mysql from 'mysql2'

const port = process.env.PORT || 3000;
const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))
app.use(cors())
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
    const extension = separateFilename[1]
    let result;
    if(extension === "pdf"){
        result = await getPdfFileURL(req.params.filename)
    }else if(extension==="png" || extension==="jpeg" || extension==="gif" || extension==="jpg"){
        result = await getImageFileURL(req.params.filename, extension)
    } else{
        result = await getFileURL(req.params.filename)
    }
    res.json({ result })
})

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log("the server is running")
})

// const con =  mysql.createConnection({
//     host: "database-2.c9esqj5yaqki.us-east-2.rds.amazonaws.com", 
//     database: "ds_db",
//     user: "admin",
//     password: "tWhzEOEXDh9v0tWH6CK2"
// });


// con.connect((err) => {
//     if(err) {
//         console.log(err.message);
//         return
//     }
//     console.log("database connected")
// })