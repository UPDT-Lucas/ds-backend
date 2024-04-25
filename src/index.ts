import express from 'express'
import fileUpload from 'express-fileupload'
import { getFileURL, getPdfFileURL, getImageFileURL, uploadFile, getFiles } from './s3'
import path from 'path';
// import mysql from 'mysql2'

const app = express();

app.use(fileUpload())

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.post('/files', async (req, res) => {
    const result = await uploadFile(req.files!.file)
    res.json({ result })
})

app.get('/files', async (req, res) => {
    const result = await getFiles()
    res.json(result.Contents)
})

app.get('/files/:filename', async (req, res) => {
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
    // res.send("hola")
    // res.json({message: "hola"})
    res.render('index')
})

app.listen(3000)

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