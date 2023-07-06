const upload = require("../config/upload");
const { getArtists, oneArtist, addArtist, updateArtist, dltArtist } = require("../controllers/artist");
const authenticate = require("../middleware/authmiddleware");
const isadmin = require("../middleware/isadmin");
const validateId = require("../middleware/valiadteId");

const router = require("express").Router();

router.get("/", getArtists);

router.get("/:id", validateId, oneArtist);

router.post("/", authenticate, isadmin, upload.single('image'), addArtist);

router.put("/:id", authenticate, isadmin, validateId, upload.single('image'), updateArtist);

router.delete("/:id", authenticate, isadmin,validateId, dltArtist);

module.exports = router