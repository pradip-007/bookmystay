import { createPool } from "mysql2/promise";

let connection = null;

export async function connectDb() {
  try {
    connection = createPool({
      host: "localhost",
      user: "root",
      password: "cdac",
      database: "bookmystay",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.log("❌ Error in DB connection:", error);
  }
  return connection;
}

export function getConnectionObject() {
  return connection;
}
