import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import routes from './routes/routes';
import swagger from "swagger-ui-express";
import docs from "./swagger.json";
import { createBuckets, uploadDefaultImages } from './services/s3/s3-service';

const port = process.env.PORT;
const server = express();

server.use(json());

server.use(cors());

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log(`Swagger on port ${port}/documentation`)
})

routes(server);

server.use("/documentation", swagger.serve, swagger.setup(docs));

createBuckets();
uploadDefaultImages();