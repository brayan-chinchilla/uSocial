# uSocial

## Levantar los servicios usando docker-compose

Ubicarse en la ruta donde está el archivo *docker-compose.yml* y ejecutar:

`docker-compose up -d`

Donde:

-d, --detach: Corre los servicios en segundo plano

Para detener los servicios ejecutar:

`docker-compose down`

Para más comandos, ejecutar `docker-compose -h` para ver los parametros y comandos disponibles.

## Levantar los sevicios sin docker-compose

## Servidor

### Construir imagen de docker

Ubicarse en la ruta donde está el *Dockerfile* y ejecutar:

`docker build -t usocial-back .`

Donde:

-t, --tag: Es el tag o nombre que tendrá la imagen

### Correr servidor

`docker run --env-file=.env -p 5000:5000 usocial-back`

Donde:

**.env** contiene las variables de entorno

```
JWT_SECRET=<secret>
PORT=<port>
COGNITO_CLIENT_ID=<id>
MONGO_URI=<uri>
```
También pueden especificarse cada una en el comando de docker run utilizando el flag `-e`. Ejemplo: `-e MONGO_URI=uri`

## Cliente

### Construir imagen de docker

Ubicarse en la ruta donde está el *Dockerfile* y ejecutar:

`docker build -t usocial-front .`

Donde:

-t, --tag: Es el tag o nombre que tendrá la imagen

### Correr pagina web
`docker run -p 80:80 usocial-front`