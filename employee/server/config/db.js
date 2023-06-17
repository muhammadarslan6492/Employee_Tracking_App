import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database!');
  } catch (err) {
    console.log(err.message);
  }
};

export default connect;
