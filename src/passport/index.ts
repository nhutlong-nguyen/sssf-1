import passport from 'passport';
import {Strategy} from 'passport-local'; //local strategy, handles username and password authentication
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'; //JSON web Token authentication
import bcrypt from 'bcryptjs'; //library for hashing and compare passwords
import {getUserLogin} from '../api/models/userModel';

//added: setup for Passport's local strategy for username and password authentication
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      console.log(username, password);
      //added: attempt to retrieve user from database
      const user = await getUserLogin(username);
      if (!user) {
        return done(null, false);
      }
      //added: compare the provided password with the stored hash using bcrypt
      if (!bcrypt.compareSync(password, user.password!)) {
        return done(null, false);
      }
      //added: return user object if successful
      return done(null, user, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
    } catch (err) {
      return done(err);
    }
  })
);

// consider .env for secret, e.g. secretOrKey: process.env.JWT_SECRET
//added: setup for Passport's JWT strategy for handling bearer token authentication
passport.use(
  new JWTStrategy(
    {
      //added: specifies how the JWT should be extracted from the request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //added: secret key to verify the token's signature
      secretOrKey: 'asdf',
    },
    (jwtPayload, done) => {
      // console.log('payload', jwtPayload);
      //added: once the token is verified, the payload is passed here
      done(null, jwtPayload);
    }
  )
);

export default passport;
