import { Request, Response } from "express";
import { setResponse } from "./set-response";
import { Student } from "../models/student.model";
import { addStudent, getStudent, getAllStudents } from "./aws/dynamo.controller";
import { saveImage } from "./aws/s3.controller";

class StudentController {
    public async addStudent(req: Request, res: Response) {
        const { username, photo }: Student = req.body;

        const student: Student = (await getStudent(username)).Item as Student;

        if (student)
            return setResponse(res, { statuscode: 400, ok: false, message: `El estudiante ${username} ya existe`, data: {} });

        try {
            const photoUrl = await saveImage('estudiantes', username, photo);

            await addStudent({ username, photo: photoUrl });
            return setResponse(res, { statuscode: 200, ok: true, message: `Se ha agregado al estudiante exitosamente`, data: {} });
        } catch (e) {
            console.error(e);
            return setResponse(res, { statuscode: 500, ok: false, message: `No se pudo agregar al estudiante`, data: {} });
        }
    }

    public async getAllStudents(_: Request, res: Response) {
        const students = (await getAllStudents()).Items;
        res.json(students);
    }
}
export default new StudentController();