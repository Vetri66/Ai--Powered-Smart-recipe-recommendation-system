// List available Gemini models
const apiKey = 'AIzaSyCBHXkns6v-78guBWxM3uwn0rIv1cjP7Po';

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    console.log('Available models:');
    data.models?.forEach(model => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log('✅', model.name);
      }
    });
  } catch (error) {
    console.log('Error:', error.message);
  }
}

listModels();