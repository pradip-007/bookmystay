import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnectionObject } from "../../db.js";
import { jwtConfig } from "../middleware/auth.js";


const { hashSync, compareSync } = bcrypt;
const { JWT_SECRET, JWT_EXPIRES_IN } = jwtConfig;

// Register User
export async function registerUser(req, res) {
  try {
    const connection = getConnectionObject();
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const hashed = hashSync(password, 10);
    const qry = `INSERT INTO users (name, email, password, phone, role)
                 VALUES ('${name}','${email}','${hashed}','${phone}','${role}')`;
    const [result] = await connection.execute(qry, [
      name,
      email,
      hashed,
      phone || null,
      role || "user",
    ]);

    return res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Email already registered" });
    return res.status(500).json({ message: "Something went wrong" });
  }
}

// Login User
export async function loginUser(req, res) {
  try {
    const connection = getConnectionObject();
    const { email, password } = req.body;

    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (rows.length === 0) return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];
    if (!compareSync(password, user.password))
      return res.status(401).json({ message: "Invalid email or password" });

    const payload = { id: user.user_id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    console.log("token: " + token);

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get All Users (Admin only)
export async function getAllUsers(req, res) {
  try {
    const connection = getConnectionObject();
    const [rows] = await connection.execute("SELECT user_id, name, email, phone, role FROM users");
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get User By ID
export async function getUserById(req, res) {
  try {
    const requestedId = Number(req.params.id);
    const loggedInUser = req.user;
    
    if (loggedInUser.role !== "admin" && loggedInUser.id !== requestedId) {
      return res.status(403).json({ message: "Access denied: You can only view your own profile." });
    }

    const connection = getConnectionObject();

    const [rows] = await connection.execute(
      "SELECT user_id, name, email, phone, role FROM users WHERE user_id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Update User
export async function updateUser(req, res) {
  try {
    const connection = getConnectionObject();
    const { name, email, phone, role } = req.body;
    const { id } = req.params;

    // only admin or self can update
    if (req.user.role !== "admin" && req.user.id !== Number(id))
      return res.status(403).json({ message: "Forbidden" });

    const [result] = await connection.execute(
      "UPDATE users SET name=?, email=?, phone=?, role=? WHERE user_id=?",
      [name, email, phone, role, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Delete User (Admin only)
export async function deleteUser(req, res) {
  try {
    const connection = getConnectionObject();
    const { id } = req.params;
    const [result] = await connection.execute("DELETE FROM users WHERE user_id=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
