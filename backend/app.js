const express = require("express");
const Router = require("./routes");

const app = express();
app.use(express.json());

app.use("/api", Router);

app.get('/',(req,res)=>{
  res.send("Hello world")
})

app.listen(4000, () => {
  console.log("Running backend on http://localhost:4000");
});
