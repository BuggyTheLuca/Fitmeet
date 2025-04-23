import { CreateBucketCommand, DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const userBucketName: string = process.env.USER_BUCKET!
const activityBucketName: string = process.env.ACTIVITY_BUCKET!
const activityTypeBucketName: string = process.env.ACTIVITY_TYPE_BUCKET!


const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    forcePathStyle: true
})

export async function createBuckets() {
    await s3.send(new CreateBucketCommand({Bucket: userBucketName}))
    console.log(`Bucket ${userBucketName} created successfully`)

    await s3.send(new CreateBucketCommand({Bucket: activityBucketName}))
    console.log(`Bucket ${activityBucketName} created successfully`)

    await s3.send(new CreateBucketCommand({Bucket: activityTypeBucketName}))
    console.log(`Bucket ${activityTypeBucketName} created successfully`)
}

export async function uploadUserAvatar(file: Express.Multer.File) {
    await deletePreviousFile(file, userBucketName!);
    const uploadParams = {
        Bucket: userBucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    }

    await s3.send(new PutObjectCommand(uploadParams));

    return `${process.env.S3_ENDPOINT}/${userBucketName}/${file.originalname}`;
}

export async function uploadActivityImage(file: Express.Multer.File) {
    await deletePreviousFile(file, userBucketName!);
    const uploadParams = {
        Bucket: activityBucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    }

    await s3.send(new PutObjectCommand(uploadParams));

    return `${process.env.S3_ENDPOINT}/${activityBucketName}/${file.originalname}`;
}

async function deletePreviousFile (file: Express.Multer.File, bucketName: string){
    const baseFileName = file.originalname.split('.').slice(0, -1).join('.');
    const listParams = { Bucket: bucketName, Prefix: baseFileName };
    const listResponse = await s3.send(new ListObjectsV2Command(listParams));

    if (listResponse.Contents) {
        for (const object of listResponse.Contents) {
            if (object.Key?.startsWith(baseFileName)) {
                await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key }));
            }
        }
    }
}


export async function uploadDefaultImages () {
    const userFilePath = path.join(__dirname, "../../../resources/images/default-avatar.jpg");
    const userFileStream = fs.createReadStream(userFilePath);

    const activityTypeFilePath = path.join(__dirname, "../../../resources/images/default-activity-type-image.jpg");
    const activityTypeFileStream = fs.createReadStream(activityTypeFilePath);
  
    const userUploadParams = {
      Bucket: userBucketName,
      Key: "default-avatar.jpg",
      Body: userFileStream,
      ContentType: "image/jpeg",
    };

    const activityTypeUploadParams = {
        Bucket: activityTypeBucketName,
        Key: "default-activity-type-image.jpg",
        Body: activityTypeFileStream,
        ContentType: "image/jpeg",
    };

    await s3.send(new PutObjectCommand(userUploadParams));
    console.log(`Default user avatar uploaded to ${process.env.S3_ENDPOINT}/${userBucketName}/default-avatar.jpg`)
    await s3.send(new PutObjectCommand(activityTypeUploadParams));
    console.log(`Default activity type image uploaded to ${process.env.S3_ENDPOINT}/${activityTypeBucketName}/default-activity-type-image.jpg`)
  
  }