# Variables de entorno

Agregar un archivo `.env` al mismo nivel que package.json

```
JWT_SECRET=<your_secret>
PORT=<port>
COGNITO_CLIENT_ID=<client_id>
MONGO_URI=<uri>
CLIENT_URL=<client_url>
```

# Credenciales AWS

Para que funcione correctamente los servicios de aws, se necesita una o varias llaves de acceso.
Para ello, cree un archivo `.aws/credentials` en esta ubicación y agregue las claves de la siguiente manera.

```
[default]
aws_access_key_id = <access_key>
aws_secret_access_key = <secret_access_key>
```