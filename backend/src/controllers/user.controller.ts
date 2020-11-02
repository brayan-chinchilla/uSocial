import { Request, Response } from "express";
import { setResponse } from "./set-response";
import { User } from "../models/user.model";
import { saveImage } from "./aws/s3.controller";
import { getUser, addUser } from "./aws/dynamo.controller";
import { compareFaces } from "./aws/rekognition.controller";
import { generateToken } from "../routes/auth.jwt";
import { RegisterUser } from "./aws/cognito.controller";

class UserController {
    public async loginWithUsernameAndPassword(req: Request, res: Response) {
        const { username, password, email }: User = req.body;
        const user: User = (await getUser(username)).Item as User;

        if (user) {
            if (user.password === password) {
                const token = generateToken({ username });
                return setResponse(res, { statuscode: 200, ok: true, message: 'Ha iniciado sesion correctamente', data: { token } });
            } else {
                return setResponse(res, { statuscode: 400, ok: false, message: 'La contraseña ingresada es incorrecta' });
            }
        }

        return setResponse(res, { statuscode: 404, ok: false, message: `Usuario ${username} no encontrado`, });
    }

    public async register(req: Request, res: Response) {
        const { name, username, email, password }: User = req.body;

        if (!name || !username || !email || !password)
            return setResponse(res, { statuscode: 400, ok: false, message: `El usuario ${username} ya existe` });

        RegisterUser({ name, username, email, password })
            .then((value) => {
                console.log('Then:', value)
                const token = generateToken({ username });
                return setResponse(res, { statuscode: 200, ok: true, message: `Se ha registrado exitosamente`, data: { token } });
            })
            .catch((error) => {
                console.error('Catch:', error)
                return setResponse(res, { statuscode: 400, ok: false, message: 'No se pudo completar el registro', data: { error } });
            });

        // if (user)

        // try {
        //     let photoUrl = '';
        //     if (photo) {
        //         photoUrl = await saveImage('usuarios', username, photo);
        //     }

        //     await addUser({ username, password, photo: photoUrl });
        //     const token = generateToken({ username });
        //     return setResponse(res, { statuscode: 200, ok: true, message: `Se ha registrado exitosamente`, token });
        // } catch (_) {
        //     return setResponse(res, { statuscode: 500, ok: false, message: `No se pudo realizar el registro` });
        // }
    }
}

export default new UserController();