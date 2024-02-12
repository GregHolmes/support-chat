import { Router } from 'express';
import * as auth from './routes/auth';
import * as authUtil from './utils/auth';

const router = Router();

function routes(): Router {
  router.get('/', (req, res) => {
    res.send('hello world')
  })
  router.post('/login', auth.login);
  router.post('/register', auth.register);
  router.get('/request-token', authUtil.verifyJWT, auth.ablyTokenRequest);

  return router;
}

export { routes };
