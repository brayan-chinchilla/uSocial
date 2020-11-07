import { Message } from "../../models/message.model";

// https://fherherand.github.io/covid-19-data-update/timeseries.json
interface BotMetadata {
    botStep: string;
    casos: {
        pais: string;
        fecha: string;
        tipo: string;
    },
    grafica: {
        pais: string;
        rango: string;
    }
}

export interface BotResponse {
    message: Message,
    metadata: BotMetadata
}

export function manageBotResponse(data: BotResponse): BotResponse | undefined {
    switch (data.metadata.botStep) {
        case "":
            return firstResponse(data);
        case "casos.pais":
            return handlePais(data);
        case "casos.pais.fecha":
            return handleFecha(data);
        case "casos.pais.fecha.tipo":
            return handleTipo(data);
        default:
            return handleUnderstand(data, "No puedo atender a tu solicitud.");
    }
}

function handleUnderstand(data: BotResponse, info: string): BotResponse {
    const { message, metadata } = data;

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: info,
            dateSent: new Date(Date.now())
        },
        metadata
    }
}

function handleTipo(data: BotResponse): BotResponse {
    const { message, metadata } = data;

    switch (message.message.trim().toLowerCase()) {
        case "confirmados": 
            break;
        case "recuperados":
            break;
        case "muertes":
            break;
        case "todos":
            break;
        default:
            return handleUnderstand(data, "¿Tipo de casos? (confirmados, recuperados, muertes o todos)")
    }

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: "Ok, aqui tienes la información solicitada.",
            dateSent: new Date(Date.now())
        },
        metadata: {
            ...metadata,
            botStep: '',
            casos: {
                ...metadata.casos,
                tipo: message.message
            },
        }
    }
}

function handleFecha(data: BotResponse): BotResponse {
    const { message, metadata } = data;

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: "¿Tipo de casos? (confirmados, recuperados, muertes o todos)",
            dateSent: new Date(Date.now())
        },
        metadata: {
            ...metadata,
            botStep: 'casos.pais.fecha.tipo',
            casos: {
                ...metadata.casos,
                fecha: message.message
            }
        }
    }
}

function handlePais(data: BotResponse): BotResponse {
    const { message, metadata } = data;

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: "¿Fecha?",
            dateSent: new Date(Date.now())
        },
        metadata: {
            ...metadata,
            botStep: 'casos.pais.fecha',
            casos: {
                ...metadata.casos,
                pais: message.message
            }
        }
    }
}

function firstResponse(data: BotResponse): BotResponse | undefined {
    const { message, metadata } = data;

    switch (message.message.trim().toLowerCase()) {
        case 'casos':
            return {
                message: {
                    fromId: message.toId,
                    toId: message.fromId,
                    message: "¿País?",
                    dateSent: new Date(Date.now())
                },
                metadata: {
                    ...metadata,
                    botStep: 'casos.pais'
                },
            }
        case 'gráfica de casos':

            break;
        default:
            return handleUnderstand(data, "Bienvenido. Soy Covid Bot. Comandos disponibles: Casos, Gráfica de casos")
    }
}