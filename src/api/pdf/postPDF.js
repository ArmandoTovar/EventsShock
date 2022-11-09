import { graph } from '../../utils/graphGenerate';
const postPDF = async (ctx) => {
  var html_to_pdf = require('html-pdf-node');
  let options = { format: 'A4' };
  // Example of options with args //
  // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  const content = await graph(JSON.parse(ctx.request.body));
  let file = {
    content: content,
  };
  const pdfBuffer = await html_to_pdf.generatePdf(file, options);
  ctx.response.type = 'pdf';
  ctx.body = pdfBuffer;
};

export default postPDF;
