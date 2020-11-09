const fetch = require('node-fetch');

exports.handler = async (event) => {
    const fromDate = event.fromDate;
    const toDate = event.toDate;
    const pais = event.pais;

    const covid = await (await fetch('https://fherherand.github.io/covid-19-data-update/timeseries.json')).json();

    const covidCountry = covid[pais];

    let fromExists = false;
    
    const result = [];
    
    for (const info of covidCountry) {
        if (fromExists) {
            result.push(info);
            if (info.date === toDate) break;
        } else {
            if (info.date === fromDate) {
                result.push(info);
                fromExists = true;
            }
        }
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};