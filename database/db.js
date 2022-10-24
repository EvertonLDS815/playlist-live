const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB atlas Conectado!"))
    .catch((err) => console.error(err));
};

module.exports = connectToDb;
