import { Request, Response } from "express";
import { setResponse } from "./set-response";
import { User } from "../models/user.model";
import { saveImage } from "./aws/s3.controller";
import { generateToken } from "../routes/auth.jwt";
import { RegisterUser } from "./aws/cognito.controller";
import UserModel from "./database/User";
import bcrypt from "bcrypt";


async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

async function comparePasswords(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
}


class UserController {
    public async loginWithUsernameAndPassword(req: Request, res: Response) {
        const { username, password }: User = req.body;

        try {
            const user = await UserModel.findOne({ username });

            if (!user)
                return setResponse(res, { statuscode: 404, ok: false, message: `Usuario ${username} no encontrado`, data: {} });

            if (!(await comparePasswords(password, user.password)))
                return setResponse(res, { statuscode: 400, ok: false, message: 'La contraseña ingresada es incorrecta', data: {} });

            const token = generateToken({ username });
            return setResponse(res, { statuscode: 200, ok: true, message: 'Ha iniciado sesion correctamente', data: { token } });
        } catch (error) {
            return setResponse(res, { statuscode: 501, ok: false, message: `Ha ocurrido un error inesperado.`, data: { error } });
        }
    }

    public async register(req: Request, res: Response) {
        const { name, username, email, password }: User = req.body;
        const botmode = false;

        if (!name || !username || !email || !password)
            return setResponse(res, { statuscode: 400, ok: false, message: `Campos obligatorios: name, username, email, password`, data: {} });

        try {
            const userExists = await UserModel.findOne({ username });

            if (userExists)
                return setResponse(res, { statuscode: 400, ok: false, message: `Ya existe una cuenta con nombre de usuario ${username}`, data: {} });

            const pwd = await hashPassword(password);

            await UserModel.create({ name, username, email, botmode, password: pwd });
            const token = generateToken({ username });
            return setResponse(res, { statuscode: 200, ok: true, message: 'Cuenta registrada exitosamente', data: { token } });
        } catch (error) {
            return setResponse(res, { statuscode: 501, ok: false, message: `Ha ocurrido un error inesperado.`, data: { error } });
        }


        // RegisterUser({ name, username, email, password, botmode })
        //     .then((value) => {
        //         console.log('Then:', value)
        //         const token = generateToken({ username });
        //         return setResponse(res, { statuscode: 200, ok: true, message: `Se ha registrado exitosamente`, data: { token } });
        //     })
        //     .catch((error) => {
        //         console.error('Catch:', error)
        //         return setResponse(res, { statuscode: 400, ok: false, message: 'No se pudo completar el registro', data: { error } });
        //     });

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