import mongoose from "mongoose";
//const connection = {};
const options = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
  /* 
    autoIndex: false, // Don't build indexes
reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
reconnectInterval: 500, // Reconnect every 500ms
poolSize: 10, // Maintain up to 10 socket connections
// If not connected, return errors immediately rather than waiting for reconnect
bufferMaxEntries: 0,
connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
family: 4 // Use IPv4, skip trying IPv6
  */
};

async function connectDb() {

  if (mongoose.connections[0].readyState) {
    //if (connection.isConnected) {
    // Use existing database connection
    console.log("Using existing connection");
    return;
  }
  try {
    console.log("Making a connection with DB");
    await mongoose.connect(process.env.MONGO_SRV, options);//returns an array "connections"
    //const dbConnections = await mongoose.connect(process.env.MONGO_SRV, options);//returns an array "connections"
    console.log("DB Connected");
    //connection.isConnected = dbConnections.connections[0].readyState;
  } catch (error) {
    console.error("************utils/connectDb.js showing this error: Error making a connection with the database!**********");
    console.error(error);
  }
}

export default connectDb;