const mongoose = require('mongoose');
const connectDb = async ()=>{
    try{
        const password = encodeURIComponent(process.env.MONGO_PASSWORD.trim());
        const connectionString = `mongodb+srv://sangeetadammu12:${password}@dev-cluster.swuu5.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster`; // clustore url
       const connect = await mongoose.connect(connectionString,{useNewUrlParser: true,useUnifiedTopology: true});
       console.log('DB connected successfully', connect.connection.host, connect.connection.name)
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDb;