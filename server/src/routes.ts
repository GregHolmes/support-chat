import { Router } from 'express';
import * as auth from './routes/auth';
import * as authUtil from './utils/auth';

const router = Router();

function routes(): Router {
  router.post('/login', auth.login);
  router.get('/chat-token', authUtil.verifyJWT, auth.ablyToken);

  return router;
}

export = routes;
