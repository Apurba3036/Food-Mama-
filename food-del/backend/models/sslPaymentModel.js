import mongoose from "mongoose";

// Define the schema for SSL payment information
const sslPaymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },  // Unique transaction ID
  userId: { type: String, required: true },  // User ID as a string
  items: [
    {
    
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      image: { type: String },
      category: { type: String },
      quantity: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },  // Payment amount
  address: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    Area: { type: String },
    zipcode: { type: String, required: true },
    country: { type: String, required: true, default: 'Bangladesh' },
    phone: { type: String, required: true },
    state: { type: String }
  },
  status: { type: String, default: 'pending' },  // Payment status (pending, completed, etc.)
  date: { type: Date, default: Date.now },  // Date of the payment/order
    
  createdAt: { type: Date, default: Date.now },  // Timestamp for when the payment was initiated
});

// Create the model for the payment schema
const sslPaymentModel = mongoose.models.sslPayment || mongoose.model("sslPayment", sslPaymentSchema);

export default sslPaymentModel;
