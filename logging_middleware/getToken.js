const getToken = require("./auth");

getToken()
  .then((token) => {
    console.log(token);
  })
  .catch((err) => {
    console.log(err.response?.data || err.message);
  });