//This is where the required files are imported.
const express = require("express");
const path = require("path");
const fs = require("fs");
const {v4: uuid} = require("uuid");
//This opens any port that Heroku requests or then it opens 3001.
const PORT = process.env.PORT || 3001;
//This makes an instance of an express server.
const app = express();

//Middleware
//Allows the pages to pull files from the public folder.
app.use(express.static(path.join(__dirname, "public")));
//Allows the server to accept json from the client.
app.use(express.json());

//This is a route handler to send the client notes.html.
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

//The client visits the route of /api/notes and then the server reads db.json as a string and then it parses it as an object and then it return the object as json as a response.
app.get("/api/notes", (req, res) => {
    const db = fs.readFileSync(path.join(__dirname, "db/db.json"), "utf-8");
    const parsedData = JSON.parse(db);
    res.json(parsedData);
})
//The client uploads data
app.post("/api/notes", (req, res) => {
    //added const for the readability of the code.
    const pathToDb = path.join(__dirname, "db/db.json")
    const newNote = req.body;
    //This makes a unique id and attaches it to the copy of req.body.
    newNote.id = uuid();
    //This where the server reads the database, utf-8 makes it into a string from binary.
    const db = fs.readFileSync(pathToDb, "utf-8");
    //This is where the server parses the db into an array of objects.
    const parsedData = JSON.parse(db);
    parsedData.push(newNote);
    //This is where the json gets made back into a string for the file system.
    fs.writeFileSync(pathToDb, JSON.stringify(parsedData), "utf-8");
    //This is where the server responds with a json object.
    res.json(newNote);

})

app.delete("/api/notes/:id", (req, res) => {
    //this is storing the id from the query parameters as a new variable.
    const noteId = req.params.id;
    const pathToDb = path.join(__dirname, "db/db.json");
    //This is where the server reads the database, utf-8 converts binary to a string.
    const db = fs.readFileSync(pathToDb, "utf-8");
    //This is where the server parses the db into an array of objects.
    const parsedData = JSON.parse(db);
    //This filters out the note where its id matches the note id and keeps the rest as a new array.
    const noteArray = parsedData.filter(note => note.id !== noteId);
    //This is where the json gets made back into a string for the file system.
    fs.writeFileSync(pathToDb, JSON.stringify(noteArray), "utf-8");
    //This is where the server responds with a json object.
    res.json(noteArray);
})
//This is last because it checks all the routes and if its not one of the defined routes then it sends the client to the index.html.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

//This tells the server where to listen.
app.listen(PORT, () => console.log(`Server listening at ${PORT}`));