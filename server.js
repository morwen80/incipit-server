const express = require('express');
const server = express();
const body_parser = require('body-parser');

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  next();
});


const db = require('diskdb');
db.connect('./data', ['prompts']);

server.use(body_parser.json());

server.get("/json", (req, res) => {
   res.json({ message: "Hello world" });
});

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});


// CREATE
server.post("/prompts", (req, res) => {
   const singlePrompt = req.body;
   db.prompts.save(singlePrompt);

   res.json(db.prompts.find());
});


// READ ONE NOTE
server.get("/prompts/:id", (req, res) => {
   const promptId = req.params.id;
   const prompts = db.prompts.find({ _id: promptId });
   if (prompts.length) {
      res.json(prompts);
   } else {
      res.json({ message: `singlePrompt ${promptId} doesn't exist` })
   }
});


// READ ALL THE NOTES
server.get("/prompts", (req, res) => {
   res.json(db.prompts.find());
});


// UPDATE
server.put("/prompts/:id", (req, res) => {
   const promptId = req.params.id;
   const singlePrompt = req.body;

   db.prompts.update({ _id: promptId }, singlePrompt);

   res.json(db.prompts.find());
});


// DELETE
server.delete("/prompts/:id", (req, res) => {
   const promptId = req.params.id;

   db.prompts.remove({ _id: promptId });
   res.json(db.prompts.find());
});
