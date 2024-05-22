import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';
import siteRoutes from './routes/site';
import adminRoutes from './routes/admin';
import { reqIntercepter } from './utils/reqIntercepter';

const app = express();
app.use(cors());

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.all('*', reqIntercepter);
app.use('/admin', adminRoutes);
app.use('/', siteRoutes);

const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`🚀 Rodando na porta: ${port}`);
    });
};
const regularServer = http.createServer(app);
if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string),
    };
    const secServer = https.createServer(options, app);
    runServer(80, regularServer);
    runServer(443, secServer);
} else {
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    runServer(serverPort, regularServer);
}
