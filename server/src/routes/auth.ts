import { Request, Response } from 'express';
import db from '../models';
import { createJWT } from '../utils/auth';
import { generateToken } from '../services/ably';

async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      res.status(400).json({ error: "Invalid input", message: "Both email and password are required" });
      return;
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      // User doesn't exist, handle accordingly (e.g., create user)
      console.log('User does not exist for email:', email);
      res.sendStatus(404);
      return;
    }

    // Create a JWT for the user
    const jwtToken = createJWT(user.username);

    // Log successful login
    console.log(`User logged in: ${user.email}`);

    // Return the JWT
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred" });
  }
}

async function ablyToken(req: Request, res: Response): Promise<void> {
  try {
    const user = await db.User.findOne({ where: { id: req.user.sub } })

    if (!user) {
      // User already exists.. redirect to register
      res.sendStatus(404)
  
      return
    }

    const ablyAuthToken = await generateToken(req, res)

    // Return the JWT
    res.status(200).json({ token: ablyAuthToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred" });
  }
}

export { login, ablyToken };
