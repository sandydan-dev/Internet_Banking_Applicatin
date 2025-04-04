const { app } = require("./index");
const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log("Server Listening on port", PORT);
});
