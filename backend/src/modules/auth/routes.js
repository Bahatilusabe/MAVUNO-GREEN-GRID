import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { config } from "../../config.js";
import { createUser, getUserByEmail } from "./service.js";
import { registerUserSchema, loginUserSchema } from "./schemas.js";

const router = Router();

function zodMessage(err) {
  return err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
}

router.post("/register", async (req, res, next) => {
  try {
    const validated = registerUserSchema.parse(req.body);
    const newUser = await createUser(validated);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    if (err instanceof ZodError) return res.status(400).json({ error: zodMessage(err) });
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

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ error: `Account is ${user.status}` });
    }

    const token = jwt.sign(
      { sub: user.id, id: user.id, role: user.role, email: user.email },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) return res.status(400).json({ error: zodMessage(err) });
    next(err);
  }
});

export default router;