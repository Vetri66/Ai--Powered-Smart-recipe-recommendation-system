// Test script to verify Supabase and Gemini connections
// Run with: node test-connections.js

// Manual env vars from .env.local
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://zwtkkgywznvfbejhbclv.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dGtrZ3l3em52ZmJlamhiY2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNTIwMDMsImV4cCI6MjA3NTgyODAwM30.xRWCtpSJAeHFoYNtn5X5zTHyltgAwszt8zUGUoQc6Vk';
process.env.GEMINI_API_KEY = 'AIzaSyCBHXkns6v-78guBWxM3uwn0rIv1cjP7Po';

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.log('❌ Supabase env vars missing');
    return false;
  }
  
  console.log('✅ Supabase URL:', url);
  console.log('✅ Supabase Key:', key.substring(0, 20) + '...');
  
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: { 'apikey': key }
    });
    console.log('✅ Supabase connection:', response.status === 200 ? 'SUCCESS' : 'FAILED');
    return response.status === 200;
  } catch (error) {
    console.log('❌ Supabase error:', error.message);
    return false;
  }
}

async function testGemini() {
  console.log('\n🔍 Testing Gemini AI connection...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Gemini API key missing');
    return false;
  }
  
  console.log('✅ Gemini Key:', apiKey.substring(0, 20) + '...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }]
      })
    });
    
    console.log('✅ Gemini connection:', response.status === 200 ? 'SUCCESS' : 'FAILED');
    return response.status === 200;
  } catch (error) {
    console.log('❌ Gemini error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Smart Recipe System connections...\n');
  
  const supabaseOk = await testSupabase();
  const geminiOk = await testGemini();
  
  console.log('\n📊 Results:');
  console.log('Supabase:', supabaseOk ? '✅ Working' : '❌ Failed');
  console.log('Gemini AI:', geminiOk ? '✅ Working' : '❌ Failed');
  
  if (supabaseOk && geminiOk) {
    console.log('\n🎉 All connections working! Your app should work properly.');
  } else {
    console.log('\n⚠️  Some connections failed. Check your .env.local file and API keys.');
  }
}

main().catch(console.error);