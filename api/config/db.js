const mongoose = require("mongoose");

const connectDB = async () => {
    
        let mongoURI;
        if (process.env.NODE_ENV === "production") {
        mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.plttm.mongodb.net/${process.env.MONGO_DB_PROD}?retryWrites=true&w=majority`;
        } else {
        mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.plttm.mongodb.net/${process.env.MONGO_DB_DEVELOPMENT}?retryWrites=true&w=majority`;
        }


    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("mongoDB connected");
    } catch (err) {
        console.log("err", err);
        console.error("mongoDB NOT connected");
        process.exit(1)

    }
}

module.exports = connectDB
