var http = require("http");
var express = require("express")();
var cors = require("cors");
var dotenv = require("dotenv");
var axios = require("axios");
var bodyParser = require("body-parser");
var fs = require("fs");
var fastify = require("fastify")({
  logger: true,
  https: {
    key: fs.readFileSync("./sslcert/key.pem"),
    cert: fs.readFileSync("./sslcert/fullchain.pem"),
  },
});
var proxy = require("@fastify/http-proxy");

dotenv.config();

const { API_HTTP_URL, CORS_ORIGIN, HTTP_PORT, WS_PORT } = process.env;

express.use(bodyParser.json());
express.use(cors({ origin: CORS_ORIGIN }));

const server = http.createServer(express);

express.post("/", async function (req, res) {
  try {
    const response = await axios.post(API_HTTP_URL, {
      ...req.body,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data");
  }
});

fastify.register(proxy, {
  upstream: API_HTTP_URL,
  prefix: "/",
  websocket: true,
});

fastify.listen({ port: WS_PORT, host: "0.0.0.0" });
server.listen(HTTP_PORT);
