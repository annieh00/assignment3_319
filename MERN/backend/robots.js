//Annie Huynh
//annieh47@iastate.edu
//March 16, 2024

var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

const { MongoClient } = require("mongodb");
// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);

app.get("/listRobots", async (req, res) => {
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");
  const query = {};
  const results = await db.collection("robot").find(query).limit(100).toArray();
  console.log(results);
  res.status(200);
  res.send(results);
});

app.get("/:id", async (req, res) => {
  const robotid = Number(req.params.id);
  console.log("Robot to find :", robotid);
  await client.connect();
  console.log("Node connected successfully to GET-id MongoDB");
  const query = { id: robotid };
  const results = await db.collection("robot").findOne(query);
  console.log("Results :", results);
  if (!results) res.send("Not Found").status(404);
  else res.send(results).status(200);
});

app.get("/listRobots/:id", async (req, res) => {
  const robotid = Number(req.params.id);
  console.log("Robot to find :", robotid);
  await client.connect();
  console.log("Node connected successfully to GET-id MongoDB");
  const query = { id: robotid };
  const results = await db.collection("robot").findOne(query);
  console.log("Results :", results);
  if (!results) res.send("Not Found").status(404);
  else res.send(results).status(200);
});

app.post("/addRobot", async (req, res) => {
  await client.connect();
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  const newDocument = {
    id: req.body.id, // also "id": req.body.id,
    name: req.body.name, // also "name": req.body.name,
    price: req.body.price, // also "price": req.body.price,
    description: req.body.description, // also "description": req.body.description,
    imageUrl: req.body.imageUrl, // also "imageUrl": req.body.imageUrl
  };

  const results = await db.collection("robot").insertOne(newDocument);
  res.status(200);
  res.send(results);
});

app.delete("/deleteRobot", async (req, res) => {
  await client.connect();
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  const newDocument = {
    id: req.body.id, // also "id": req.body.id,
    name: req.body.name, // also "name": req.body.name,
    price: req.body.price, // also "price": req.body.price,
    description: req.body.description, // also "description": req.body.description,
    imageUrl: req.body.imageUrl, // also "imageUrl": req.body.imageUrl
  };

  const results = await db.collection("robot").deleteOne(newDocument);
  res.status(200);
  res.send(results);
});

app.delete("/deleteRobot/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await client.connect();
    console.log("Robot to delete :", id);
    const query = { id: id };
    // delete
    const results = await db.collection("robot").deleteOne(query);
    res.status(200);
    res.send(results);
  } catch (error) {
    console.error("Error deleting robot:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.put("/updateRobot/:id", async (req, res) => {
  const id = Number(req.params.id);
  const query = { id: id };
  await client.connect();
  console.log("Robot to Update :",id);
  // Data for updating the document, typically comes from the request body
  console.log(req.body);
  const updateData = {
  $set:{
  "name": req.body.name,
  "price": req.body.price,
  "description": req.body.description,
  "imageUrl": req.body.imageUrl
  }
  };
  // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
  const options = { };
  const results = await db.collection("robot").updateOne(query, updateData, options);
  res.status(200);
  res.send(results);
  });

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
