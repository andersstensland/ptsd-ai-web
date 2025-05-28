const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testPDFUpload() {
  try {
    const pdfPath = '/Users/andersstensland/Documents/HK_PTSD/Webapp/ptsd-ai-web/PTSD_STUFF/Complex PTSD Lancet.pdf';
    
    if (!fs.existsSync(pdfPath)) {
      console.log('PDF file not found at:', pdfPath);
      return;
    }

    console.log('File found, creating form data...');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath), {
      filename: 'Complex PTSD Lancet.pdf',
      contentType: 'application/pdf'
    });

    console.log('Uploading to http://localhost:3000/api/documents/upload');
    
    const response = await fetch('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);

    if (response.status === 200) {
      console.log('✅ PDF upload test PASSED!');
    } else {
      console.log('❌ PDF upload test FAILED!');
    }

  } catch (error) {
    console.error('Test error:', error);
  }
}

testPDFUpload();
