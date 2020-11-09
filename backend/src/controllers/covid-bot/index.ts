import { Message } from "../../models/message.model";
import fetch from "node-fetch";

interface BotMetadata {
    botStep: string;
    casos: {
        pais: string;
        fecha: string;
        tipo: string;
    },
    grafica: {
        fromDate: string;
        toDate: string;
        result: any[];
    }
}

export interface BotResponse {
    message: Message,
    metadata: BotMetadata
}

export async function manageBotResponse(data: BotResponse): Promise<BotResponse> {
    switch (data.metadata.botStep) {
        case "":
            return firstResponse(data);
        case "casos.pais":
            return handlePais(data, 'casos.pais.fecha');
        case "casos.pais.fecha":
            return handleFecha(data);
        case "casos.pais.fecha.tipo":
            return handleTipo(data);
        case "grafica.pais":
            return handlePais(data, 'grafica.pais.fecha');
        case "grafica.pais.fecha":
            return handleRangoFecha(data);
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

async function handleTipo(data: BotResponse): Promise<BotResponse> {
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
            return handleUnderstand(data, "Tipo no válido. Ingresalo de nuevo (confirmados, recuperados, muertes o todos)")
    }

    const date = metadata.casos.fecha;

    const covid = await (await fetch('https://sssx0gfhtj.execute-api.us-east-1.amazonaws.com/produccion', {
        method: 'POST',
        body: JSON.stringify({
            "fecha": date,
            "pais": metadata.casos.pais
        })
    })).json();

    const result = JSON.parse(covid.body);

    if (!(result.length > 0)) {
        return {
            message: {
                fromId: message.toId,
                toId: message.fromId,
                message: "No hay información disponible para tu solicitud.",
                dateSent: new Date(Date.now())
            },
            metadata: {
                ...metadata,
                botStep: '',
                casos: {
                    ...metadata.casos,
                    fecha: '',
                    pais: '',
                    tipo: ''
                },
            }
        }
    }

    let resultString = "";

    switch (message.message) {
        case "confirmados":
            resultString = `Casos confirmados en ${metadata.casos.pais} el día ${date}: ${result[0].confirmed}`;
            break;
        case "recuperados":
            resultString = `Casos recuperados en ${metadata.casos.pais} el día ${date}: ${result[0].recovered}`;
            break;
        case "muertes":
            resultString = `Muertos en ${metadata.casos.pais} el día ${date}: ${result[0].deaths}`;
            break;
        case "todos":
            resultString = `Casos en ${metadata.casos.pais} el día ${date}: Confirmados: ${result[0].confirmed}, Recuperados: ${result[0].recovered}, Muertes: ${result[0].deaths}`;
            break;
    }

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: "Ok, aqui tienes la información solicitada. " + resultString,
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
    console.log(message.message)
    const dateData = message.message.split('-');
    const day = dateData[0];
    const month = dateData[1];
    const year = dateData[2];

    if (day?.length !== 2 || month?.length !== 2 || year?.length !== 4) {
        return handleUnderstand(data, "Fecha inválida. Ingresala de nuevo (dd-mm-yyyy)");
    }

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
                fecha: `${year}-${month}-${day}`
            }
        }
    }
}

async function handleRangoFecha(data: BotResponse): Promise<BotResponse> {
    const { message, metadata } = data;

    const dates = message.message.trim().split('a');
    let fromDate = dates[0];
    let toDate = dates[1];

    const fromData = fromDate.trim().split('-');
    const fromDay = fromData[0];
    const fromMonth = fromData[1];
    const fromYear = fromData[2];

    if (fromDay?.length !== 2 || fromMonth?.length !== 2 || fromYear?.length !== 4) {
        return handleUnderstand(data, "Rango de fecha inválido. Ingresalo de nuevo (dd-mm-yyyy a dd-mm-yyyy)");
    }

    const toData = toDate.trim().split('-');
    const toDay = toData[0];
    const toMonth = toData[1];
    const toYear = toData[2];

    if (toDay?.length !== 2 || toMonth?.length !== 2 || toYear?.length !== 4) {
        return handleUnderstand(data, "Rango de fecha inválido. Ingresalo de nuevo (dd-mm-yyyy a dd-mm-yyyy)");
    }

    fromDate = `${fromYear}-${fromMonth}-${fromDay}`;
    toDate = `${toYear}-${toMonth}-${toDay}`;

    const covid = await (await fetch('https://sssx0gfhtj.execute-api.us-east-1.amazonaws.com/produccion/graph', {
        method: 'POST',
        body: JSON.stringify({
            fromDate,
            toDate,
            "pais": metadata.casos.pais
        })
    })).json();

    const result = JSON.parse(covid.body);

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: `Puedes ver la gráfica aquí: ${process.env.CLIENT_URL}/covid19`,
            dateSent: new Date(Date.now())
        },
        metadata: {
            ...metadata,
            botStep: '',
            grafica: {
                fromDate,
                toDate,
                result
            }
        }
    }
}

async function handlePais(data: BotResponse, nextStep: string): Promise<BotResponse> {
    const { message, metadata } = data;

    const pais = capitalize(message.message.toLowerCase());

    const covid = await (await fetch('https://fherherand.github.io/covid-19-data-update/timeseries.json')).json();

    if (!covid[pais]) {
        return handleUnderstand(data, "No se encontro informacion del pais: " + message.message + ". ¿País?")
    }

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: nextStep === 'casos.pais.fecha' ? '¿Fecha (dd-mm-yyyy)?' : '¿Fecha (dd-mm-yyyy a dd-mm-yyyy)?',
            dateSent: new Date(Date.now())
        },
        metadata: {
            ...metadata,
            botStep: nextStep,
            casos: {
                ...metadata.casos,
                pais
            }
        }
    }
}

function firstResponse(data: BotResponse): BotResponse {
    const { message, metadata } = data;

    switch (message.message.trim().toLowerCase()) {
        case 'casos':
            break;
        case 'gráfica de casos':
            break;
        default:
            return handleUnderstand(data, "Bienvenido. Soy Covid Bot. Comandos disponibles: Casos, Gráfica de casos")
    }

    return {
        message: {
            fromId: message.toId,
            toId: message.fromId,
            message: "¿País?",
            dateSent: new Date(Date.now())
        },
        metadata: {
            ...metadata,
            botStep: message.message.trim().toLowerCase() === 'casos' ? 'casos.pais' : 'grafica.pais'
        },
    }
}

function capitalize(phrase: string) {
    return phrase.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}