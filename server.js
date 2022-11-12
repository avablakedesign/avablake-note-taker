const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    console.info(req.hostname);
    res.send("test");
})
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.listen(PORT, () => console.log(`Server listening at ${PORT}`));