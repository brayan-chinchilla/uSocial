const fetch = require('node-fetch');

exports.handler = async (event) => {
    const fecha = event.fecha;
    const pais = event.pais;

    const covid = await (await fetch('https://fherherand.github.io/covid-19-data-update/timeseries.json')).json();

    const covidCountry = covid[pais];

    const result = covidCountry.filter(info => info.date === fecha);

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};