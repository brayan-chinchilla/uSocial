import { Request, Response } from "express";
import { Types } from "mongoose";
import { Post } from "../models/post.model";
import { saveImage } from "./aws/s3.controller";
import { setResponse } from "./set-response";
import PostModel from "../controllers/database/Post"
import { detectLabels } from "./aws/rekognition.controller";
import { translateText, detectLanguage } from "./aws/translate.controller";

class PostController {
    public async newPost(req: Request, res: Response) {
        const {text, image, user_id}:Post = req.body

        if (!user_id || !image )
            return setResponse(res, { statuscode: 400, ok: false, message: `Campos obligatorios: username, image`, data: {} });

        try {
            const postId = Types.ObjectId();
            const imageUrl = await saveImage('posts', postId.toHexString(), image);

            const labels: Array<string> = [];
            const rekognition_res = await detectLabels(imageUrl)
            rekognition_res.Labels?.forEach(label => {
                labels.push(label.Name || "");
            })

            var needs_translation = false;
            if(text){
                try{
                    const comprehend_res = await detectLanguage(text);
                    //@ts-ignore
                    needs_translation = comprehend_res.Languages[0].LanguageCode != "es";
                }catch(e){}
            }
            const newPost = await PostModel.create({ _id: postId, user_id, image: imageUrl, text, timestamp: Date(), labels, needs_translation});

            return setResponse(res, { statuscode: 200, ok: true, message: ``, data: newPost });
        } catch (e) {
            console.error(e);
            return setResponse(res, { statuscode: 500, ok: false, message: ``, data: {} });
        }
    }

    public async getPosts(req: Request, res: Response){
        const user_id = req.params.user_id;
        const filter:any = {};
        if(req.body.labels){
            filter.labels = {$all: req.body.labels}
        }

        try{
            const posts = await PostModel.find(filter).sort({timestamp: -1});
            return setResponse(res, { statuscode: 200, ok: true, message: `Posts filtrados exitosamente`, data: posts });
        } catch (e) {
            console.error(e);
            return setResponse(res, { statuscode: 500, ok: false, message: `Ocurrio un error`, data: {} });
        }
    }

    public async translatePost(req: Request, res: Response){
        const {text}:Post = req.body;

        try{
            const translate_res = await translateText(text);
            const translatedText = translate_res.TranslatedText;
            return setResponse(res, { statuscode: 200, ok: true, message: `Traduccion exitosa`, data: {translatedText} });
        } catch (e) {
            console.error(e);
            return setResponse(res, { statuscode: 500, ok: false, message: `Ocurrio un error`, data: {} });
        }
    }
}
export default new PostController();