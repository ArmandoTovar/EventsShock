import Router from 'koa-router';

import postUpload from './postUpload';
import { koaBody } from 'koa-body';
const router = new Router();
router.post(
  '/',
  koaBody({
    formidable: {
      uploadDir: process.cwd() + '/src/uploads', // directory where files will be uploaded
      keepExtensions: true, // keep file extension on upload
      multiples: false,
    },
    multipart: true,
    urlencoded: true,
    formLimit: '5mb',
  }),
  postUpload,
);

export default router;
