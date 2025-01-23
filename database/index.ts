import mongoose from "mongoose";

let isConnected = false; // this is a global variable that will be used to check if the user is connected to the database or not

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("using existing database connection");
    return;
  }

  // Connect to our database

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "auth-nextauth-v5",

      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("new database connection");
  } catch (error) {
    console.log("error connecting to database");
    console.log(error);
  }
};
