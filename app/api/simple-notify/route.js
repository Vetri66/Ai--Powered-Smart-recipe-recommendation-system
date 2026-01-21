export async function POST(request) {
  const { email, message } = await request.json()
  
  console.log(`Sending to ${email}: ${message}`)
  
  return Response.json({ 
    success: true, 
    message: "Notification sent",
    email,
    timestamp: new Date().toISOString()
  })
}