import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import JSON5 from 'json5'


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '300kb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/recordings", (req, res) => {
    fs.writeFile("./db.json", JSON.stringify(req.body), err => {
        if (err) {
            res.status(400).send("Error while adding the recordings to the database");
        }
        else {
            res.status(201).send("Recordings added successfully.");
        }
    })
});

app.get("/recordings", (req, res) => {
    fs.readFile("./db.json", 'utf-8', (err, recordingsJSON) => {
        if (err) {
            res.status(500).send("Error while getting the recordings from the database")
        }
        else {
            const recordings=JSON5.parse(recordingsJSON);

            res.status(200).send(recordings)
        }
    })
})

app.listen(7777, () => console.log("Server address http://localhost:7777"));

//node -r esm server.js