import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "./service.js";
import { registerUserSchema, loginUserSchema } from "./schemas.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-dev-secret";

router.post("/register", async (req, res, next) => {
  try {
    const validated = registerUserSchema.parse(req.body);
    const newUser = await createUser(validated);
    
    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (err) {
    if (err.message === "A user with this email already exists.") {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginUserSchema.parse(req.body);
    
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    if (user.STATUS !== 'ACTIVE') {
      return res.status(403).json({ error: `Account is ${user.STATUS.toLowerCase()}` });
    }

    const isValid = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.ID, role: user.ROLE, email: user.EMAIL },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.ID,
        full_name: user.FULL_NAME,
        email: user.EMAIL,
        role: user.ROLE
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;