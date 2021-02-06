const connectDB = require("./api/config/db");
const JobOffer = require("./api/models/offerModel");
const exampleOffers = require("./api/data/exampleOffers");

connectDB();

const importData = async () => {
    try {

        await JobOffer.deleteMany({});

        await JobOffer.insertMany(exampleOffers);

        console.log("Data import success");

        process.exit();
    } catch (err) {
        console.error("Error with data import");
        process.exit(1);

    }
};

importData();