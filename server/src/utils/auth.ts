import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';

const jwtVerify = promisify(jwt.verify);

async function createJWT(sub: string, iss = 'chat-app'): Promise<string> {
  const jwtSecretKey = process.env.JWT_SECRET_PHRASE as string;
  const data = { iss, sub };

  const token = jwt.sign(data, jwtSecretKey);

  return token;
}

async function verifyJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const user = await jwtVerify(token, process.env.JWT_SECRET_PHRASE as string);
    // Assuming you are using Express, you might want to extend the Express Request type
    // to include the user property. If you are using a different framework, adjust accordingly.
    (req as any).user = user;

    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

export { createJWT, verifyJWT };