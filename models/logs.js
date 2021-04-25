const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    title: String,
    entry: String,
    shipIsBroken: {type: Boolean, default: true}
}, {timestamps: true});

//Collection name
const logsData = mongoose.model('logsData', logSchema);

//make this exportable to be accessed in `app.js`
module.exports = logsData;
