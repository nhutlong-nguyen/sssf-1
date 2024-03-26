import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import passport from '../../passport';
import CustomError from '../../classes/CustomError';
import {User} from '../../types/DBTypes';

const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    {session: false},
    (err: Error, user: Partial<User>) => {
      if (err || !user) {
        next(new CustomError('Invalid username/password', 200));
        return;
      }
      req.login(user, {session: false}, (error) => {
        if (error) {
          next(new CustomError('Login error', 400));
          return;
        }

        delete user.password; // this is the reason for partial
        const token = jwt.sign(user, 'asdf');
        return res.json({user, token});
      });
    }
  )(req, res, next);
};

export {login};

//added: PartialUser is used in the callback signature of the passport.authenticate
//method to type the user parameter. This indicate that the user object might not have all
//the properties that are defined in the User type, specifically the password property