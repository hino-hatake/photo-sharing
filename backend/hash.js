const bcrypt = require("bcrypt");
["123456"].forEach(async (pw) => console.log(await bcrypt.hash(pw, 10)));
