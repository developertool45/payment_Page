require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.send('I am working ')
});

app.get('/pay', (req, res) => {
    res.render('payment'); 
});

app.post('/create-order', async (req, res) => {
    const { mobile, amount } = req.body;
    if (!mobile || !amount || amount <= 0) {
        return res.status(400).render('payment', { error: "Invalid input data" });
    }

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    // Create an order
    const options = {
        amount: amount * 100, 
        currency: "INR",
        receipt: "receipt#1",
    };

    try {
        const order = await instance.orders.create(options);
        res.render('payment', {
            key: process.env.RAZORPAY_KEY_ID, 
            orderId: order.id,
            amount: amount,
            mobile: mobile
        });
    } catch (error) {
        res.status(500).render('payment', { error: "Failed to create order" });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port ', port);
});
