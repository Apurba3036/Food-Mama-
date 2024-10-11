import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  food_items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      category: { type: String, required: true },
      __v: { type: Number }
    }
  ]
});

const restaurantModel = mongoose.models.Restaurant || mongoose.model('restaurents', restaurantSchema);

export default restaurantModel;
