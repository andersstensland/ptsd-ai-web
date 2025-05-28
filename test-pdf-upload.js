const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testPDFUpload() {
  try {
    // Test with one of the PTSD documents
    const pdfPath = '/Users/andersstensland/Documents/HK_PTSD/Webapp/ptsd-ai-web/PTSD_STUFF/Complex PTSD Lancet.pdf';
    
    if (!fs.existsSync(pdfPath)) {
      console.log('PDF file not found at:', pdfPath);
      return;
    }

    const fileBuffer = fs.readFileSync(pdfPath);
    console.log('File loaded, size:', fileBuffer.length, 'bytes');

    // Create FormData
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Create a blob-like object
    const file = {
      buffer: fileBuffer,
      name: 'Complex PTSD Lancet.pdf',
      type: 'application/pdf'
    };
    
    formData.append('file', fileBuffer, {
      filename: 'Complex PTSD Lancet.pdf',
      contentType: 'application/pdf'
    });

    console.log('Uploading to http://localhost:3000/api/documents/upload');
    
    const response = await fetch('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Test error:', error);
  }
}

testPDFUpload();
