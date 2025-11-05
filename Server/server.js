import express from "express";
import cors from "cors";
import { connectDb } from "./db.js";
import userRoutes from "./app/routes/userRoutes.js";

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true 
}));

app.use(express.json());

// connect DB etc
connectDb();
app.use("/users", userRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
