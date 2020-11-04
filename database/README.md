# Base de datos

### Configuración

Crear un archivo **.env** y agregar las siguientes variables de entorno:

```
MONGO_INITDB_DATABASE=<database_name>
MONGO_INITDB_ROOT_USERNAME=<db_user>
MONGO_INITDB_ROOT_PASSWORD=<db_password>
```

### Levantar el servicio

`docker-compose up --detach`

Donde:

--detatch, -d: Ejecuta el servicio en segundo plano

Para acceder al mongoshell utilizar:

`mongo -u <your username>`

### Cadena de conexión

    mongodb://<username>:<password>@<host>:27017/<database_name>

### Detener el servicio

`docker-compose down`