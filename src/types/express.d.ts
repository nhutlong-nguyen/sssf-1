/* eslint-disable @typescript-eslint/no-empty-interface */

// Passport adds the user to the Express Request object
// This file adds the User type to the Express Request object
import {User as UserType} from './DBTypes';

declare global {
  namespace Express {
    interface User extends Partial<UserType> {}
  }
}

//added: purpose of this file is to inform TypeScript that
//whenever we access 'req.user' in the express app (where req is an instance of an Express request)
//it can be expect to find the properties defined in UserType
//though they may not all be present
