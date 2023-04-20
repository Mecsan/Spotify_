require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();

const getImage = require("./helper/getimage");
const { searchAll } = require("./controllers/search");

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

require("./config/DbConnection");

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

if (process.env.NODE_ENV == "production") {
    app.use(express.static(__dirname + "/frontend/build"))

    app.use("*", (req, res) => {
        res.sendFile(__dirname + "/frontend/build/index.html");
    })
}

app.use(errhandler);

const port = process.env.PORT || 2000
app.listen(port, () => console.log(`server running on ${port}`))
