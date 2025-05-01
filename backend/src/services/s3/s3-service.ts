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

    return `http://localhost:4566/${userBucketName}/${file.originalname}`;
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

    return `http://localhost:4566/${activityBucketName}/${file.originalname}`;
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
    const userFilePath = path.join(__dirname, "../../../resources/images/default-avatar.png");
    const userFileStream = fs.createReadStream(userFilePath);

    const strengthFilePath = path.join(__dirname, "../../../resources/images/strength.jpg");
    const strengthFileStream = fs.createReadStream(strengthFilePath);
    const aerobicFilePath = path.join(__dirname, "../../../resources/images/aerobic.jpg");
    const aerobicFileStream = fs.createReadStream(aerobicFilePath);
    const balanceFilePath = path.join(__dirname, "../../../resources/images/balance.jpg");
    const balanceFileStream = fs.createReadStream(balanceFilePath);
    const flexibilityFilePath = path.join(__dirname, "../../../resources/images/flexibility.jpg");
    const flexibilityFileStream = fs.createReadStream(flexibilityFilePath);
  
    const userUploadParams = {
      Bucket: userBucketName,
      Key: "default-avatar.jpg",
      Body: userFileStream,
      ContentType: "image/jpeg",
    };

    const strengthUploadParams = {
        Bucket: activityTypeBucketName,
        Key: "strength-image.jpg",
        Body: strengthFileStream,
        ContentType: "image/jpeg",
    };

    const aerobicUploadParams = {
        Bucket: activityTypeBucketName,
        Key: "aerobic-image.jpg",
        Body: aerobicFileStream,
        ContentType: "image/jpeg",
    };

    const balanceUploadParams = {
        Bucket: activityTypeBucketName,
        Key: "balance-image.jpg",
        Body: balanceFileStream,
        ContentType: "image/jpeg",
    };

    const flexibilityUploadParams = {
        Bucket: activityTypeBucketName,
        Key: "flexibility-image.jpg",
        Body: flexibilityFileStream,
        ContentType: "image/jpeg",
    };

    await s3.send(new PutObjectCommand(userUploadParams));
    console.log(`Default user avatar uploaded to ${process.env.S3_ENDPOINT}/${userBucketName}`)
    await s3.send(new PutObjectCommand(strengthUploadParams));
    await s3.send(new PutObjectCommand(balanceUploadParams));
    await s3.send(new PutObjectCommand(aerobicUploadParams));
    await s3.send(new PutObjectCommand(flexibilityUploadParams));
    console.log(`Default activity type image uploaded to ${process.env.S3_ENDPOINT}/${activityTypeBucketName}`)
  
  }


export async function prepareBucketsAndDefaults(){
    await createBuckets();
    await uploadDefaultImages();
}