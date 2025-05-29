const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testMultipleUploads() {
  console.log('🔄 Testing multiple file uploads...');
  
  // Create multiple test files
  const files = [
    'test-file-1.txt',
    'test-file-2.txt', 
    'test-file-3.txt'
  ];
  
  // Create test content for each file
  for (let i = 0; i < files.length; i++) {
    const content = `Test File ${i + 1}

This is test file number ${i + 1} for testing the upload queue system.

PTSD Content for File ${i + 1}:
- Trauma therapy approaches
- Cognitive behavioral therapy techniques  
- EMDR therapy protocols
- Mindfulness-based interventions
- Group therapy frameworks

This content should be processed and indexed by the vector store for RAG retrieval.

Test timestamp: ${new Date().toISOString()}`;
    
    fs.writeFileSync(files[i], content);
  }
  
  console.log(`📝 Created ${files.length} test files`);
  
  // Upload files sequentially to test the queue
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    console.log(`\nUploading ${fileName}...`);
    
    try {
      const form = new FormData();
      const fileContent = fs.readFileSync(fileName);
      form.append('file', fileContent, {
        filename: fileName,
        contentType: 'text/plain'
      });

      const response = await fetch('http://localhost:3000/api/documents/upload', {
        method: 'POST',
        body: form
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`${fileName} uploaded successfully`);
        console.log(`   Title: ${result.title}`);
        console.log(`   Chunks: ${result.chunksCreated}`);
        console.log(`   ID: ${result.documentId}`);
      } else {
        console.log(`❌ ${fileName} failed:`, result.error);
      }
      
      // Small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`💥 Error uploading ${fileName}:`, error.message);
    }
  }
  
  // Clean up test files
  files.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
  
  console.log('\n🧹 Cleaned up test files');
  console.log('🎉 Multiple upload test complete!');
}

testMultipleUploads();
