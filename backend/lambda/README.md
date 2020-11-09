# Covid Functions

Se usa AWS Lambda para obtener la cantidad de casos de COVID19 de todos los tipos

Se debe implementar una API Gateway de AWS para poder invocar a las funciones lambda.

## Implementación

Se debe crear un archivo .zip incluyento los node_modules y subirlo a lambda.

Cuerpo de la petición para la función covid

```json
{
    "fromDate": "2020-05-04",
    "toDate": "2020-05-10",
    "Pais": "Guatemala"
}
```

Cuerpo de la petición para la función covid-graph

```json
{
    "fecha": "2020-05-04",
    "Pais": "Guatemala"
}
```