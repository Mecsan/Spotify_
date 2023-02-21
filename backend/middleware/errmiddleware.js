

const errhandler = (err, req, res, next) => {

    res.statusCode = err.code || 500;

    if (process.env.NODE_ENV == 'production') {
        err.message = err.message || 'internal server err';
        res.json({ success: false, msg: err.message })
    } else {
        console.log(err);
        res.json({ success: false, msg: err.stack })
    }
}

module.exports = errhandler;