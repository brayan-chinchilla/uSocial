import { Request, Response } from "express";
import { setResponse } from "./set-response";
import { User } from "../models/user.model";
import { saveImage } from "./aws/s3.controller";
import { getUser, addUser } from "./aws/dynamo.controller";
import { compareFaces } from "./aws/rekognition.controller";
import { generateToken } from "../routes/auth.jwt";

class UserController {
    public async loginWithUsernameAndPassword(req: Request, res: Response) {
        const { username, password }: User = req.body;
        const user: User = (await getUser(username)).Item as User;

        if (user) {
            if (user.password === password) {
                const token = generateToken({ username });
                return setResponse(res, { statusCode: 200, ok: true, message: 'Ha iniciado sesion correctamente', token });
            } else {
                return setResponse(res, { statusCode: 400, ok: false, message: 'La contraseña ingresada es incorrecta' });
            }
        }

        return setResponse(res, { statusCode: 404, ok: false, message: `Usuario ${username} no encontrado` });
    }

    public async loginWithRekognition(req: Request, res: Response) {
        const { username, photo }: User = req.body;
        const user: User = (await getUser(username)).Item as User;

        if (!photo)
            return setResponse(res, { statusCode: 400, ok: false, message: `Debe proporcionar una fotografia` });
        if (!user)
            return setResponse(res, { statusCode: 404, ok: false, message: `Usuario ${username} no encontrado` });
        if (!user.photo)
            return setResponse(res, { statusCode: 404, ok: false, message: `El usuario ${username} no tiene fotografia registrada` });

        try {
            const result = await compareFaces(user.photo, photo)

            if (result.FaceMatches)
                for (const face of result.FaceMatches) {
                    if (face.Similarity && face.Similarity > 90) {
                        const token = generateToken({ username });
                        return setResponse(res, { statusCode: 200, ok: true, message: 'Ha iniciado sesion correctamente', token })
                    }
                }
        } catch (error) {
            return setResponse(res, { statusCode: 400, ok: false, message: 'Verique que en la fotografía haya rostros' })
        }

        return setResponse(res, { statusCode: 404, ok: false, message: 'No se pudo iniciar sesión. La fotografia no coincide' });
    }

    public async register(req: Request, res: Response) {
        const { username, password, photo }: User = req.body;

        const user: User = (await getUser(username)).Item as User;

        if (user)
            return setResponse(res, { statusCode: 400, ok: false, message: `El usuario ${username} ya existe` });

        try {
            let photoUrl = '';
            if (photo) {
                photoUrl = await saveImage('usuarios', username, photo);
            }

            await addUser({ username, password, photo: photoUrl });
            const token = generateToken({ username });
            return setResponse(res, { statusCode: 200, ok: true, message: `Se ha registrado exitosamente`, token });
        } catch (_) {
            return setResponse(res, { statusCode: 500, ok: false, message: `No se pudo realizar el registro` });
        }
    }
}

export default new UserController();