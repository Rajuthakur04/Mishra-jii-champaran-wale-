import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const updateContacts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mishrajichamparan");
    console.log("Connected to MongoDB...");

    const db = mongoose.connection.db;

    // 1. Upsert Admin with new email
    const hashedPassword = await bcrypt.hash("Admin@123456", 10);
    await db.collection("admins").updateOne(
      { email: "nmenergyinnovation@gmail.com" },
      {
        $set: {
          name: "Mishra Ji Admin",
          email: "nmenergyinnovation@gmail.com",
          password: hashedPassword,
          role: "admin",
        },
      },
      { upsert: true }
    );
    console.log("Admin account updated/created: nmenergyinnovation@gmail.com");

    // 2. Update all shops to use 7065985868 and nmenergyinnovation@gmail.com
    const result = await db.collection("shops").updateMany(
      {},
      {
        $set: {
          phone: "+91 70659 85868",
          whatsapp: "917065985868",
          email: "nmenergyinnovation@gmail.com",
          altPhone: "+91 70659 85868",
        },
      }
    );
    console.log(`Updated ${result.modifiedCount} shops with new phone and email!`);

    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

updateContacts();

