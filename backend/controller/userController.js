import User from "../models/user.js";
import Role from "../models/role.js";
import BankDetails from "../models/bankDetail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function generateAccountNumber() {
  return Math.floor(
    1000000000000000 + Math.random() * 9000000000000000
  ).toString();
}


export const createUser = async (req, res) => {
  const { name, age, contact, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { contact } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = generateAccountNumber();

    if (role !== "user" && role !== "manager") {
      return res.status(400).json({ error: "Invalid role" });
    }

    const newUser = await User.create({
      name,
      age,
      contact,
      password: hashedPassword
    });

    await BankDetails.create({
      accountNumber,
      balance: 0,
      userId: newUser.id
    });

    await Role.create({
      name: role,
      userId: newUser.id
    });

    res.status(201).json({
      message: "User created successfully",
      accountNumber,
      role
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export const loginUser = async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    const bankDetails = await BankDetails.findOne({ where: { accountNumber } });
    if (!bankDetails)
      return res.status(404).json({ error: "Account not found" });


    const user = await User.findOne({
  where: { id: bankDetails.userId },
  include: [{ model: Role }]
});

    

    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("user found in db ============",user)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
      {
        id: user.id,
        accountNumber,
        role: user.Role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.Role.name,
      user:user
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, attributes: ["name"] },
        {
          model: BankDetails,
          attributes: ["accountNumber", "balance", "deleteRequested"],
        },
      ],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const requestDelete = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findOne({
      where: { userId: req.user.id },
    });
    if (!bankDetails)
      return res.status(404).json({ error: "Bank details not found" });

    bankDetails.deleteRequested = true;
    await bankDetails.save();

    res.json({ message: "Deletion request submitted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit request" });
  }
};

export const getDeleteRequests = async (req, res) => {
  try {
    const deleteRequests = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, attributes: ["name"] },
        {
          model: BankDetails,
          attributes: ["accountNumber", "balance"],
          where: { deleteRequested: true },
        },
      ],
    });

    res.json(deleteRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch delete requests" });
  }
};

export const approveDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const bankDetails = await BankDetails.findOne({ where: { userId: id } });
    if (!bankDetails || !bankDetails.deleteRequested)
      return res.status(404).json({ error: "No delete request found" });

    await bankDetails.destroy();
    await User.destroy({ where: { id } });

    res.json({ message: "User account deleted by manager" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
