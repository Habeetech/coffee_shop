import express from "express";
import { greet } from "../../packages/utils/index.js";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello, you've hit the server root")
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


console.log(greet("Backend"));
