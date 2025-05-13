//Nikita Sigalov, Rot Horvitz 49-2

const express = require("express");
const app = express();
const userRoutes = require("./routers/user");
const port = 3010;

app.use(express.json());

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
