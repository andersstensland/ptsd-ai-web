#!/usr/bin/env node

async function testRAGChat() {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'What are the main principles of trauma-informed care and what specific PTSD treatments are most effective?'
          }
        ],
        provider: 'deepinfra',
        model: {
          id: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
          name: 'Llama 3.1 8B Instruct',
          provider: 'deepinfra'
        },
        temperature: 0.7,
        maxTokens: 512,
        topP: 0.9,
        useRag: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('RAG Chat API Response:');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (reader) {
      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        process.stdout.write(chunk);
      }
      console.log('\n\nFull response received successfully!');
      console.log('Total length:', fullResponse.length, 'characters');
    }
    
  } catch (error) {
    console.error('❌ Error testing RAG chat:', error);
  }
}

testRAGChat();
