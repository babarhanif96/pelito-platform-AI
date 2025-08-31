const mongoose = require('mongoose')

const connectDB = async () => {

  console.log(process.env.MONGO_URI)

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI,{writeConcern: { w: 'majority' },
  });
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error1: ${error.message}`)
    // process.exit(1)
  }
}


module.exports = connectDB
