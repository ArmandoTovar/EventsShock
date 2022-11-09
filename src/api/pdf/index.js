import koaBody from 'koa-body';
import Router from 'koa-router';

import postPDF from './postPDF';

const router = new Router();

router.post('/', koaBody(), postPDF);

export default router;
