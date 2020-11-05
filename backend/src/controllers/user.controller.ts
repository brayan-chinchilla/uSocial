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
    public async updateUser(req: Request, res: Response) {
        const { userid } = req.params;
        const { botmode, email, name, password, username, photo }: User = req.body;

        try {
            const dbuser = await UserModel.findOne({ _id: userid });

            if (!dbuser) return setResponse(res, { statuscode: 404, ok: false, message: `Usuario con id ${userid} no encontrado`, data: {} });

            const otherUser = await UserModel.findOne({ username });

            if (otherUser && dbuser.id !== otherUser.id) { // Ya existe un usuario con el mismo username al que desea cambiar.
                // Si los Ids son diferentes, son distintos usuarios, por lo tanto, no puede usar ese username.
                return setResponse(res, { statuscode: 404, ok: false, message: `El username ${username} no esta disponible`, data: {} });
            }

            if (!(await comparePasswords(password, dbuser.password)))
                return setResponse(res, { statuscode: 400, ok: false, message: 'La contraseña ingresada es incorrecta', data: {} });

            let imageUrl = '';
            if (photo) imageUrl = await saveImage('usuarios', userid, photo);

            await UserModel.updateOne({ _id: userid }, { botmode, email, name, username, photo: imageUrl });

            dbuser.password = '';
            return setResponse(res, { statuscode: 200, ok: true, message: `Usuario ${dbuser.username} actualizado`, data: { user: dbuser } });
        } catch (error) {
            return setResponse(res, { statuscode: 501, ok: false, message: `No se pudo actualizar el usuario. Ha ocurrido un error inesperado`, data: { error } });
        }
    }

    public async getOneUser(req: Request, res: Response) {
        const { userid } = req.params;

        try {
            const user = await UserModel.findOne({ _id: userid });

            if (!user) return setResponse(res, { statuscode: 404, ok: false, message: `Usuario con id ${userid} no encontrado`, data: {} });

            user.password = '';
            return setResponse(res, { statuscode: 200, ok: true, message: `Usuario ${user.name}`, data: { user } });
        } catch (error) {
            return setResponse(res, { statuscode: 501, ok: false, message: `No se pudo encontrar el usuario. Id erroneo`, data: { error } });
        }
    }

    public async loginWithUsernameAndPassword(req: Request, res: Response) {
        const { username, password }: User = req.body;

        try {
            const user = await UserModel.findOne({ username });

            if (!user)
                return setResponse(res, { statuscode: 404, ok: false, message: `Usuario ${username} no encontrado`, data: {} });

            if (!(await comparePasswords(password, user.password)))
                return setResponse(res, { statuscode: 400, ok: false, message: 'La contraseña ingresada es incorrecta', data: {} });

            const token = generateToken({ username });
            user.password = '';
            return setResponse(res, {
                statuscode: 200, ok: true, message: 'Ha iniciado sesion correctamente',
                data: { token, user }
            });
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

            const newUser = await UserModel.create({ name, username, email, botmode, password: pwd });
            const token = generateToken({ username });

            newUser.password = '';
            return setResponse(res, { statuscode: 200, ok: true, message: 'Cuenta registrada exitosamente', data: { token, user: newUser } });
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