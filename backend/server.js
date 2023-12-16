require("dotenv").config();
const express = require("express");
const path = require("path")
const cors = require('cors');
const app = express();

const getImage = require("./helper/getimage");
const { searchAll } = require("./controllers/search");

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

require("./config/DbConnection");
require("./config/redisConnect");

const errhandler = require("./middleware/errmiddleware");

const authRoute = require("./routes/auth");
const songRoute = require("./routes/song");
const playlistRoute = require("./routes/playlist");
const artistRoute = require("./routes/artist");

app.use("/api/user", authRoute);
app.use("/api/song", songRoute);
app.use("/api/artist", artistRoute);
app.use("/api/playlist", playlistRoute);

app.get("/api/search", searchAll);
app.get("/api/image/:name", getImage);

console.log({name:process.env.NODE_ENV})

if (process.env.NODE_ENV == "production") {
    const staticPath  = path.resolve(__dirname,"..","frontend","build");
    app.use(express.static(staticPath))

    app.use("*", (req, res) => {
        res.sendFile(staticPath+"/index.html");
    })
}

app.use(errhandler);

const port = process.env.PORT || 2000
app.listen(port, () => console.log(`server running on ${port}`))
