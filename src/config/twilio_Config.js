const twilio = require("twilio");

const accoundsid = process.env.ACCOUND_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accoundsid, authToken);

module.exports = client;
