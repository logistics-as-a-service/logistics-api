/* eslint-disable consistent-return */
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import config from 'config';

import CustomError from '../../Utils/CustomError';
import User from '../../database/entity/User';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { secret } = config.get('auth');

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  'jwt',
  new JWTStrategy(params, async (payload, done) => {
    const { id } = payload.user;

    try {
      const user = await User.findOne(id); // .findById(id);
      if (!user) return done(null, false, new Error('Incorrect login credentials.'));

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) throw new Error();

        const check = await user.validatePassword(password);
        if (!check) throw new CustomError(400, 'Invalid login credentials, check and try again.');

        if (user?.isDisabled === true)
          throw new CustomError(401, 'Account disabled or Unauthorized Access');

        done(null, user);
      } catch (error) {
        done(error.message);
      }
    }
  )
);
