import {Translate} from 'aws-sdk'

export function translateText(text:string){
    return new Translate().translateText(
        {
            "SourceLanguageCode": "auto",
            "TargetLanguageCode": "es",
            "Text": text
        }
    ).promise();
}