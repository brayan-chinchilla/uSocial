import { Response } from "express";

interface ResponseObj {
    statusCode: number;
    ok: boolean;
    message: string;
    token?: string;
}

export function setResponse(res: Response, response: ResponseObj) {
    res.statusCode = response.statusCode;
    res.json({...response});
}