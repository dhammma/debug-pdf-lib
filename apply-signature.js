const fs = require('fs').promises;
const pdf = require('pdf-lib');

const ORIGINAL_DOCUMENT_FILENAME = process.argv[2];

const getSignedDocumentFilename = (name) => {
  const arr = name.split('.');
  arr[arr.length - 2] = arr[arr.length - 2] + '-signed';
  return arr.join('.');
}

const SIGNED_DOCUMENT_FILENAME = getSignedDocumentFilename(ORIGINAL_DOCUMENT_FILENAME);

const main = async () => {
  const signature = await fs.readFile('./signature.png');
  const originalDocument = await fs.readFile(ORIGINAL_DOCUMENT_FILENAME);
  const pdfOriginal = await pdf.PDFDocument.load(originalDocument, { ignoreEncryption: true });
  const pdfImage = await pdfOriginal.embedPng(signature);
  
  const page = pdfOriginal.getPage(0);
  const rotation = page.getRotation();
  console.log('rotation', rotation);
  page.drawImage(pdfImage, {
    x: 10,
    y: 10,
    width: 50,
    height: 50
  });
  const modifiedPdf = await pdfOriginal.save();
  const modifiedDocument = Buffer.from(modifiedPdf);

  await fs.writeFile(SIGNED_DOCUMENT_FILENAME, modifiedDocument);
}

main();