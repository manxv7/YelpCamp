// Run This File only To Seed The Database

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("MongoDB Connected");
});

function sample(array) {
    return array[Math.floor(Math.random() * array.length)]
};

//To Seed Our Database

const seedDB = async() => {
    await Campground.deleteMany({}); //To delete all existing data in db
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61cc4b75529d82efa70cde5e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'http://source.unsplash.com/collection/483251',
            description: 'This is a nice campground.This is a nice campground.This is a nice campground.This is a nice campground.This is a nice campground.',
            price
        })
        await camp.save();
    }

}



seedDB().then(() => {
    mongoose.connection.close();
})