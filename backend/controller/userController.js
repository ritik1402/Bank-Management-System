import User from "../models/user.js";
import Role from "../models/role.js";
import BankDetails from "../models/bankDetail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { parse } from "dotenv";

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
    // console.log("user found in db ============",user);

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



export const checkBalance = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findOne({ where: { userId: req.user.id } });
    
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank detaails not found" });
    }

    res.json({ balance: bankDetails.balance });
  } catch (err) {
    console.error("Error in checkBalance:", err);
    res.status(500).json({ error: "Could not retreive balance" });
  }
};

export const withdraw = async(req,res) =>{
  try{
    const bankDetails = await BankDetails.findOne({where: {userId: req.user.id}})
    if(!bankDetails) return res.status(404).json({error:"bank detials not found"});   
    const  amount = req.body.amount; 
   
    if(amount <= 0) return res.status(400).json({error:"Invalid amount"});
    if(amount > bankDetails.balance) return res.status(400).json({error:"Insufficient balance"});
    const newBalance = bankDetails.balance - amount;
    await bankDetails.update({balance:newBalance});
    res.json({message:"Withdrawal successful",newBalance});
  }
        catch (err){
    console.error("Error in withdraw:",err)
    res.status(500).json({error: "could not withdraw money",err})
  }
};

export const credit = async (req,res)=>{
  try{
const bankDetails = await BankDetails.findOne({where : {
  userId: req.user.id
  
}})
// console.log(bankDetails);
if(!bankDetails) return res.status(404).json({error: "bank details not found"});

const amount = req.body.amount;
 console.log(amount,typeof(amount));
if(amount <= 0) return res.status(400).json({error: "Invalid amount"});

const newBalance =  parseFloat(bankDetails.balance)  + amount;

console.log(bankDetails.balance);
console.log(amount);
console.log(newBalance);
await bankDetails.update({balance:newBalance});

res.json({message:"credit successfull",newBalance});

  }
  catch (err){
    console.log("Error in  credit balance",err);
    res.status(500).json({error:"counld not credit balance",err})
  }
}

export const transfer = async (req,res)=>{
  try {

  
  const bankDetail = await BankDetails.findOne({where:{
    userId : req.user.id
  }})
  if(!bankDetail)return res.status(404).json({error: "bank detials not found"});
  const amount = req.body.amount;

  const accountNumber_toTransfer = req.body.accountNumberTransfer;
  const bankDetailsTransfer = await BankDetails.findOne({where: {
    accountNumber: accountNumber_toTransfer
  }});
  if(!bankDetailsTransfer)return res.status(404).json({error: "No account found"});
  const newBalance = bankDetail.balance - amount;
  const newBalanceTransfer = bankDetailsTransfer.balance + amount;
  await bankDetail.update({balance:newBalance});
  await bankDetailsTransfer.update({balance:newBalanceTransfer});
  res.json({message:"transfer successful"});
  }

  catch(err) {
    console.log("Error in tranfser");
    res.status(500).json({error:"could not transfer money",err})
  }

}

export const seeBalance = async (req, res) => {
  console.log("api called succesfully");
  try {
    
    const {accNumber} = req.params;
    // console.log(accNumber);
    const bankDetails = await BankDetails.findOne({ where: { accountNumber: accNumber },
    });
    
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found" });
    }

    res.json({ balance: bankDetails.balance });
  } catch (err) {
    console.error("Error in checkBalance:", err);
    res.status(500).json({ error: "Could not retreive balance",err });
  }
};




  
