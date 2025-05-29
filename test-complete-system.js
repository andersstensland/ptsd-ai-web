#!/usr/bin/env node
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

class UploadSystemTester {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async testDocumentsList() {
    console.log('\nTesting documents list API...');
    try {
      const response = await fetch(`${this.baseUrl}/api/documents/list`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Documents list API working');
        console.log(`Found ${data.totalDocuments} documents with ${data.totalChunks} total chunks`);
        
        // Show first 5 documents
        const sampleDocs = data.documents.slice(0, 5);
        console.log('Sample documents:');
        sampleDocs.forEach(doc => {
          console.log(`   • ${doc.title} (${doc.chunkCount} chunks, ${doc.type})`);
        });
        
        return true;
      } else {
        console.log('❌ Documents list API failed:', data.error);
        return false;
      }
    } catch (error) {
      console.log('💥 Documents list API error:', error.message);
      return false;
    }
  }

  async testSingleUpload() {
    console.log('\n📤 Testing single file upload...');
    
    const testContent = `Upload System Test Document

This document is created to test the complete upload functionality including:

✅ File Processing
✅ Progress Tracking  
✅ Toast Notifications
✅ State Persistence
✅ Skeleton Loaders
✅ Upload Queue Management

PTSD-Related Content:
- Trauma-informed care approaches
- Evidence-based treatment protocols
- Cognitive Processing Therapy (CPT)
- Prolonged Exposure (PE) therapy
- Eye Movement Desensitization and Reprocessing (EMDR)
- Narrative Exposure Therapy (NET)
- Mindfulness-based stress reduction
- Somatic experiencing approaches

Generated at: ${new Date().toISOString()}`;

    const fileName = 'system-test-upload.txt';
    fs.writeFileSync(fileName, testContent);

    try {
      const form = new FormData();
      const fileContent = fs.readFileSync(fileName);
      form.append('file', fileContent, {
        filename: fileName,
        contentType: 'text/plain'
      });

      console.log('📡 Sending upload request...');
      const response = await fetch(`${this.baseUrl}/api/documents/upload`, {
        method: 'POST',
        body: form
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Upload successful!');
        console.log(`   Document: ${result.title}`);
        console.log(`   Chunks: ${result.chunksCreated}`);
        console.log(`   ID: ${result.documentId}`);
        
        // Clean up
        fs.unlinkSync(fileName);
        return result;
      } else {
        console.log('Upload failed:', result.error);
        fs.unlinkSync(fileName);
        return null;
      }
    } catch (error) {
      console.log('Upload error:', error.message);
      if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
      return null;
    }
  }

  async testDocumentSearch(query = 'PTSD treatment therapy') {
    console.log(`\n🔍 Testing document search for: "${query}"`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/documents/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 3 })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Search API working');
        console.log(`🎯 Found ${data.totalResults} relevant results`);
        
        data.results.forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.title} (similarity: ${result.similarity?.toFixed(3) || 'N/A'})`);
          console.log(`      📝 Preview: ${result.content.substring(0, 100)}...`);
        });
        
        return true;
      } else {
        console.log('❌ Search failed:', data.error);
        return false;
      }
    } catch (error) {
      console.log('💥 Search error:', error.message);
      return false;
    }
  }

  async runFullTest() {
    console.log('🚀 Starting comprehensive upload system test...');
    console.log('=' .repeat(60));

    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Documents list
    totalTests++;
    if (await this.testDocumentsList()) passedTests++;

    // Test 2: Single upload
    totalTests++;
    if (await this.testSingleUpload()) passedTests++;

    // Test 3: Document search
    totalTests++;
    if (await this.testDocumentSearch()) passedTests++;

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`📈 Success rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! Upload system is working correctly.');
      console.log('\n🔍 Next steps to verify in the browser:');
      console.log('   1. Navigate to http://localhost:3001');
      console.log('   2. Go to Knowledge Base section');
      console.log('   3. Check skeleton loaders when page loads');
      console.log('   4. Upload files and verify progress indicators');
      console.log('   5. Check toast notifications');
      console.log('   6. Navigate between pages to test state persistence');
      console.log('   7. Check upload status indicators in sidebar');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }

    return passedTests === totalTests;
  }
}

// Run the tests
const tester = new UploadSystemTester();
tester.runFullTest().catch(console.error);
