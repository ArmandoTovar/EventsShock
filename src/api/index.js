import Router from 'koa-router';

import pdf from './pdf';
import upload from './upload';
const router = new Router();

router.use('/pdf', pdf.routes());
router.use('/upload', upload.routes());
export default router;
