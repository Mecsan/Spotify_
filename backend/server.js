require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();

const getImage = require("./helper/getimage");
const { search } = require("./controllers/search");

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

require("./config/DbConnection");

const errhandler = require("./middleware/errmiddleware");

const authRoute = require("./routes/auth");
const songRoute = require("./routes/song");
const playlistRoute = require("./routes/playlist");
const artistRoute = require("./routes/artist");

app.use("/user", authRoute);
app.use("/song", songRoute);
app.use("/artist", artistRoute);
app.use("/playlist", playlistRoute);

app.get("/search", search);
app.get("/image/:name", getImage);


if (process.env.NODE_ENV == "production") {
    app.use(express.static(__dirname + "/frontend/build"))

    app.use("*", (req, res) => {
        res.sendFile(__dirname + "/frontend/build/index.html");
    })
}


app.use(errhandler);

app.listen(process.env.PORT, () => console.log(`server running on ${process.env.PORT}`))
