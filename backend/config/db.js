import mongoose from "mongoose";
import dns from "dns";

// Ensure SRV records can be resolved reliably across ISPs & Windows networks
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (dnsErr) {
  // fallback to system DNS
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mishrajichamparan", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`[MongoDB Tip]: Make sure your IP is whitelisted (0.0.0.0/0) in MongoDB Atlas Network Access.`);
  }
};

