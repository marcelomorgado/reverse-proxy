var WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:9001", { rejectUnauthorized: false });

ws.on("error", console.error);

ws.on("open", function open() {
  ws.send("something");
});

ws.on("message", function message(data) {
  console.log("received: %s", data);
});
