import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../models';
import { createJWT } from '../utils/auth';
import { tokenRequest } from '../services/ably';

interface CustomRequest extends Request {
  user?: {
    iss: string,
    sub: string,
    iat: number
  };
}

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
    const jwtToken = await createJWT(user.username);

    // Log successful login
    console.log(`User logged in: ${user.email}`);

    // Return the JWT
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred" });
  }
}

async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, username } = req.body;

    // Input validation
    if (!email || !password || !username) {
      res.status(400).json({ error: "Invalid input", message: "Email, password, and username are required" });
      return;
    }
    console.log(db.User);
    const existingUser = await db.User.findOne({ where: {
      [Op.or]: [{username}, {email}]
    } });

    if (existingUser) {
      console.log('User already exists with either email or username');
      res.sendStatus(401);
      return;
    }

    // Create a user.
    const user = await db.User.create({
      email,
      password,
      username
    })

    // Create a JWT for the user
    const jwtToken = await createJWT(user.username);

    // Log successful login
    console.log(`User registered in: ${user.email}`);

    // Return the JWT
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error('Error during register:', error);
    res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred" });
  }
}

async function ablyTokenRequest(req: CustomRequest, res: Response): Promise<void> {
  try {
    if (req.user?.sub === undefined) {
      console.log('undefined');
      res.sendStatus(404)
  
      return
    }
    
    const user = await db.User.findOne({ where: { username: req.user.sub } })

    if (!user) {
      console.log('user doesnt exist');
      res.sendStatus(404)
  
      return
    }

    res.json(await tokenRequest(user.username))

    return
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred" });
  }
}

export { ablyTokenRequest, login, register };
