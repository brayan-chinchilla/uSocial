import { S3 } from "aws-sdk";

type S3FolderName = 'usuarios' | 'publicaciones' | 'posts';

export const bucketName = 'pro2-images-grupo5';

export async function saveImage(folderName: S3FolderName, fileName: string, base64: string) {
    const data = base64.split(',');
    const ext = data[0].split(';')[0].split(':')[1].split('/')[1];
    fileName = fileName + '.' + ext;
    const buff = Buffer.from(data[1], 'base64');

    const putObjectPromise = new S3({ apiVersion: '2006-03-01' }).putObject({
        Bucket: bucketName + '/' + folderName,
        Key: fileName,
        Body: buff,
        ACL: 'public-read'
    }).promise();

    await putObjectPromise
    return `https://${bucketName}.s3.amazonaws.com/${folderName}/${fileName}`;
}

export async function deleteImage(folderName: S3FolderName, fileName: string) {
    await new S3({}).deleteObject({
        Bucket: bucketName + '/' + folderName,
        Key: fileName
    }).promise();
}