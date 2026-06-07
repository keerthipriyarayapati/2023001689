const axios = require("axios");
const getToken = require("./auth");

async function Log(stack, level, pkg, message) {
  try {
    const token = await getToken();

    await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (err) {}
}

module.exports = Log;