import { Ably } from 'ably/promises';
import { Request, Response } from 'express';

const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

async function generateToken(req: Request, res: Response): Promise<void> {
  try {
    // Assume you have a user ID that needs to be associated with the Ably token
    const userId: string = req.user?.id; // Replace with your actual user ID retrieval logic

    if (!userId) {
      res.status(400).json({ error: 'User ID not provided' });
      return;
    }

    // Generate a token request for the specified user ID
    const tokenRequest = await ably.auth.createTokenRequest({ clientId: req.user?.username });

    // Respond with the generated token request
    res.status(200).json({ tokenRequest });
  } catch (error) {
    console.error('Error generating Ably token:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
  }
}

export { generateToken };
