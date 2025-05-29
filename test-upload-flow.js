const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUploadFlow() {
  try {
    console.log('🔄 Testing upload flow...');
    
    // Create form data with the test file
    const form = new FormData();
    const fileContent = fs.readFileSync('./test-upload.txt');
    form.append('file', fileContent, {
      filename: 'test-upload.txt',
      contentType: 'text/plain'
    });

    console.log('Uploading test file...');
    
    // Upload to the API endpoint on port 3001
    const response = await fetch('http://localhost:3001/api/documents/upload', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('Upload successful!');
      console.log(`Processed: ${result.title}`);
      console.log(`Chunks created: ${result.chunksCreated}`);
    } else {
      console.log('Upload failed:', result.error);
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testUploadFlow();
