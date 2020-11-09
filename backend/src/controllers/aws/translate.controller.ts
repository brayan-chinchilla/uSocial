import {Translate, Comprehend} from 'aws-sdk'

export function translateText(text:string){
    return new Translate().translateText({
        "SourceLanguageCode": "auto",
        "TargetLanguageCode": "es",
        "Text": text
    }
    ).promise();
}

export function detectLanguage(text:string){
    return new Comprehend().detectDominantLanguage({
        "Text":text
    }).promise();
}