import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const isManager = (req, res, next) => {
  if (req.user.role !== "manager")
    return res.status(403).json({ error: "Manager access only" });
  next();
};

export const isUser = (req, res, next) => {
  if (req.user.role !== "user")
    return res.status(403).json({ error: "User access only" });
  next();
};
