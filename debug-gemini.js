// Debug Gemini API to see exact error
const apiKey = 'AIzaSyCBHXkns6v-78guBWxM3uwn0rIv1cjP7Po';

async function testGemini() {
  console.log('🔍 Testing Gemini API...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }]
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ SUCCESS');
    } else {
      console.log('❌ FAILED');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testGemini();