// code away!
const port = 5000;
const server = require("./server");

server.listen(port, (req, res) => {
  console.log(`server listening on port ${port}`);
});
