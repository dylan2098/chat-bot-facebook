import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import database from './configs/database';

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);

webRoutes(app);

let port = process.env.PORT || 8080;

database.connect();

app.listen(port, () => {
    console.log("App is running at the port : " + port);
})