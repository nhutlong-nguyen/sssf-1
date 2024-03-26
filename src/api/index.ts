import express from 'express';

import userRoute from './routes/userRoute';
import catRoute from './routes/catRoute';
import authRoute from './routes/authRoute';
import passport from 'passport';
import {MessageResponse} from '../types/MessageTypes';

const router = express.Router();

//added: initialize Passport so it can authenticate requests
router.use(passport.initialize());

//GET route for root path, returns a JSON object, describing available routes
router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'routes: auth, users, cats',
  });
});

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/cats', catRoute);

export default router;
