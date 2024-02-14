import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  PassengerName: {
    type: String,
    required: true
    },
  tripId: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  cabNumber: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: false
  }
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
