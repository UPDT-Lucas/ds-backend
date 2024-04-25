import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3'
import { AWS_BUCKET_ACCES_KEY, AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_BUCKET_SECRET_KEY } from './config'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs'

const client = new S3Client({
    region: AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: AWS_BUCKET_ACCES_KEY!,
        secretAccessKey: AWS_BUCKET_SECRET_KEY!,
    },
})

export async function uploadFile(file: any) {
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Body: stream,
        Bucket: AWS_BUCKET_NAME,
        Key: file.name
    }
    const command = new PutObjectCommand(uploadParams)
    return await client.send(command)
}

export async function getFile(filename: string){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    return await client.send(command)
}

export async function getFiles() {
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    })
    return await client.send(command)
}

export async function getImageFileURL(filename: string, extension: string){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename,
        ResponseContentType: `image/${extension}`
    })
    return await getSignedUrl(client, command, { expiresIn: 3600 })
}

export async function getFileURL(filename: string){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename,
    })
    return await getSignedUrl(client, command, { expiresIn: 3600 })
}

export async function getPdfFileURL(filename: string){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename,
        ResponseContentType: 'application/pdf'
    })
    return await getSignedUrl(client, command, { expiresIn: 3600 })
}
