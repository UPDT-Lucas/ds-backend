import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, ObjectCannedACL } from '@aws-sdk/client-s3'
import { AWS_BUCKET_ACCES_KEY, AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_BUCKET_SECRET_KEY } from './config'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const baseURL = "https://sd-project-bucket.s3.us-east-2.amazonaws.com"

export const client = new S3Client({
    region: AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: AWS_BUCKET_ACCES_KEY!,
        secretAccessKey: AWS_BUCKET_SECRET_KEY!,
    },
})

export async function uploadFile(file: any) {
    const uploadParams = {
        Body: file.data,
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
    }   
    const command = new PutObjectCommand(uploadParams)
    return await client.send(command)
}

export async function getFiles() {
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    })
    return await client.send(command)
}

export async function getFileURL(filename: string){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    try {
        await client.send(command)
    } catch(error: any) {
        if(error.$metadata.httpStatusCode == "404"){
            return "file not found"
        }else if(error.$metadata.httpStatusCode == "403"){
            return "page not found"
        }else{
            return "error"
        }
    }
    return `${baseURL}/${filename}`
}