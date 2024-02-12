import * as Ably from 'ably/promises';
import { Request, Response } from 'express';

interface CustomRequest extends Request {
  user?: {
    iss: string,
    sub: string,
    iat: number
  };
}

interface TokenRequest {
  capability: string;
  clientId?: string;
  keyName: string;
  mac: string;
  nonce: string;
  timestamp: number;
  ttl?: number;
}

console.log(process.env.ABLY_API_KEY)
// const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
const ably = new Ably.Rest.Promise({ key:'sJ076w.oahzEg:8WxtPS3U8WCQ03fFlVydFzKLtjGltKsuJEgXJ27DivI'})
// const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

async function tokenRequest(clientId: string): Promise<TokenRequest> {
  return await ably.auth.createTokenRequest({ clientId: clientId });
}

async function generateToken(req: CustomRequest, res: Response): Promise<void> {
  try {
    if (req.user?.sub === undefined) {
      res.sendStatus(404)
  
      return
    }

    // Assume you have a user ID that needs to be associated with the Ably token
    const username: string | undefined = req.user?.sub; // Replace with your actual user ID retrieval logic

    if (!username) {
      res.status(400).json({ error: 'User ID not provided' });
      return;
    }

    // Generate a token request for the specified user ID
    const tokenRequest = await ably.auth.createTokenRequest({ clientId: req.user?.sub });

    // Respond with the generated token request
    res.status(200).json({ 'token': tokenRequest });

    return
  } catch (error) {
    console.error('Error generating Ably token:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
  }
}

export { generateToken, tokenRequest };
