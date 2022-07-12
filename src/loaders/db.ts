import mongoose from 'mongoose';
import config from '../config';
import User from '../models/User';
import Information from '../models/Information';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);

    mongoose.set('autoCreate', true);

    console.log('Mongoose Connected ...');

    User.createCollection().then(function (collection) {
      console.log('User Collection is created!');
    });

    Information.createCollection().then(function (collection) {
      console.log('Information Collection is created!');
    });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
