import express, {Request} from 'express';
import {
  catDelete,
  catGet,
  catListGet,
  catPost,
  catPut,
} from '../controllers/catController';
//multer is a middleware which is used for uploading files
import multer, {FileFilterCallback} from 'multer';
//these imports are used to validate and sanitize request parameters adn body data
import {body, param} from 'express-validator';
import passport from '../../passport';
import {getCoordinates, makeThumbnail} from '../../middlewares';

//added: fileFilter is used by multer to determine
//which files should be uploaded
//if the file is an image, it allows the upload, otherwise, it rejects it
const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//added: configure multer with a destination for file uploads and fileFilter
const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

router
  .route('/')
  .get(catListGet)
  .post(
    passport.authenticate('jwt', {session: false}),
    upload.single('cat'),
    makeThumbnail,
    getCoordinates,
    body('cat_name').notEmpty().escape(),
    body('birthdate').isDate(),
    body('weight').isNumeric(),
    catPost
  );

router
  .route('/:id')
  .get(param('id').isNumeric(), catGet)
  .put(
    passport.authenticate('jwt', {session: false}),
    param('id').isNumeric(),
    catPut
  )
  .delete(
    passport.authenticate('jwt', {session: false}),
    param('id').isNumeric(),
    catDelete
  );

export default router;
