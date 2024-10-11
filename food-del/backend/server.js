import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import foodModel from "./models/foodModel.js"
import restaurantModel from "./models/restaurentsModel.js"
import mongoose from 'mongoose';
import axios from "axios"
import orderModel from "./models/orderModel.js"
import sslPaymentModel from "./models/sslPaymentModel.js"

// app config
const app = express()
const port = process.env.PORT || 4000;


// middlewares
app.use(express.json())
app.use(cors())

// db connection
connectDB()
app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({});
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching restaurants' });
  }
});

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the restaurant from the database using the ID
    const restaurant = await restaurantModel.findById(id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Respond with the restaurant data
    res.json({ data: restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/getall", async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ success: false, message: "Error fetching food items." });
  }
});

app.post('/create-payment', async (req, res) => {
  try {
    // Create a unique transaction ID
    const trid = new mongoose.Types.ObjectId().toString();
    const paymentinfo = req.body;

    // Prepare data for SSLCommerz payment gateway
    const data = {
      store_id: "atten66f2d7b8551b1",
      store_passwd: "atten66f2d7b8551b1@ssl",
      total_amount: paymentinfo.amount,
      currency: 'BDT',
      tran_id: trid,
      success_url: `http://localhost:4000/success-payment/${trid}`,
      fail_url: 'http://localhost:3030/fail',
      cancel_url: 'http://localhost:3030/cancel',
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: 'Hall Booking',
      product_category: 'Service',
      product_profile: 'general',
      cus_name: 'Customer Name',
      cus_email: 'customer@example.com',
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      shipping_method: "NO",
      multi_card_name: "mastercard,visacard,amexcard",
    };

    // Save the payment info in sslPaymentModel with 'pending' status
    const sslPayment = new sslPaymentModel({
      transactionId: trid,  // Transaction ID
      userId: paymentinfo.userId,  // User ID
      items: paymentinfo.items,  // Items array from request
      amount: paymentinfo.amount,  // Total amount
      address: paymentinfo.address,  // Address object
      paymentstatus: 'pending',  // Default status
      
    });

    await sslPayment.save(); // Save the payment info to the database

    // Send the payment request to SSLCommerz
    const response = await axios({
      method: "POST",
      url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });

    // Return the payment URL to the client
    res.send({
      paymentUrl: response.data.GatewayPageURL
    });

  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).send("Failed to create payment");
  }
});


app.post('/success-payment/:trid', async (req, res) => {
  const { trid } = req.params;

  try {
    // Fetch payment info from sslPayment collection
    const sslPayment = await sslPaymentModel.findOne({ transactionId: trid });
    // console.log(sslPayment)
    if (!sslPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
  
   
    // Create a new order using the payment info
    const newOrder = new orderModel({
      userId: sslPayment.userId, // Assuming userId is sent from the client
      items: sslPayment.items,   // Assuming items are sent from the client
      amount: sslPayment.amount,
      address: sslPayment.address, // Assuming address is sent from the client
      status: 'Food Processing', // Default order status
      payment: true // Mark payment as completed
    });

    await newOrder.save(); // Save the new order to the database

    res.redirect('http://localhost:5173/success');
  } catch (error) {
    console.error('Error processing success payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
  });

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))