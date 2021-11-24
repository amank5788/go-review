const mongoose = require('mongoose');
const Product = require('../models/product')

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/productdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < 3; i++) {
        const prod = new Product({
            author: '618108487f40850236ad7760',
            title: `macbook`,
            image: 'https://i.gadgets360cdn.com/products/large/macbook-air-m1-2020-db-800x600-1607604365.png',
            description: 'nice',
            device: 'laptop',
            price: '1000',
        })
        await prod.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})