const mongoose = require('mongoose');

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((connect) => {
      console.log(`Base de données connectée: ${connect.connection.host}:${connect.connection.port}/${connect.connection.name}`);
    })
    // .catch((err) => {
    //   console.error(`Database Error: ${err}`);
    //   process.exit(1);
    // });
};

module.exports = dbConnection;