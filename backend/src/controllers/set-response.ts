import { Response } from "express";

interface ResponseObj {
    statuscode: number;
    ok: boolean;
    message: string;
    data: object;
}

export function setResponse(res: Response, response: ResponseObj) {
    res.statusCode = response.statuscode;
    res.json({ ...response });
}