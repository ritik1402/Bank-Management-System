
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const createUser = async (req, res) => {
  const { name, age, contact, password } = req.body;

  try {
 
    const existingUser = await User.findOne({ where: { contact } });
    if (existingUser) {
      return res.status(400).json({ error: "Contact already registered" });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({
      name,
      age,
      contact,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const loginUser = async (req, res) => {
  const { contact, password } = req.body;

  try {
    const user = await User.findOne({ where: { contact } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }


    const token = jwt.sign(
      { id: user.id, contact: user.contact },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await User.destroy({ where: { id } });
    res.json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
