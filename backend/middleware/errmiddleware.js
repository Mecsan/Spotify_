

const errhandler = (err, req, res, next) => {

    res.statusCode = err.code || 500;
    console.log(err);

    if (process.env.NODE_ENV == 'production') {
        err.message = err.message || 'internal server err';
        res.json({ success: false, msg: err.message })
    } else {
        res.json({ success: false, msg: err.stack })
    }
}

module.exports = errhandler;