import mongoose from 'mongoose'
const connection = {};

async function connectDb(){
    if(connection.isConnected){
        console.log("Using an existing db connection");
        return;
    }
    //Use new database connection
    const db = await mongoose.connect(process.env.MONGO_SRV, {
        //https://mongoosejs.com/docs/deprecations.html
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("DB connected");
    connection.isConnected = db.connection[0].readyState;

}
export default connectDb;