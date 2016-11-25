module.exports = {
  "port": process.env.BS_PORT || 9101,
  "proxy": "http://localhost:" + (process.env.EXPRESS_PORT || 3000),
  "ui": { "port": process.env.BS_PORT_UI || 9102 },
  "files": [
    "./dist/**/*.*"
  ]
};
