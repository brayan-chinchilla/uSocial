import { Rekognition } from "aws-sdk";
import { bucketName } from "./s3.controller";

export function compareFaces(S3PhotoUrl: string, base64: string) {
    const data = base64.split(',');
    const buff = Buffer.from(data[1], 'base64');

    const path = S3PhotoUrl.split('/');
    const imageName = path.pop();
    const folderName = path.pop();

    return new Rekognition().compareFaces({
        TargetImage: {
            S3Object: {
                Bucket: bucketName,
                Name: folderName + '/' + imageName
            }
        },
        SourceImage: {
            Bytes: buff
        }
    }).promise();
}