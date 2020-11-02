import { connect } from 'mongoose';

connect(process.env.MONGO_URI || '', { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
    if (err) {
        console.log("No se pudo conectar a la base de datos", err.message);
    } else {
        console.log("Base de datos conectada");
    }
});