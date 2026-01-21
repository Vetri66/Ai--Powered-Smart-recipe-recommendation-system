# ⚡ SUPER SIMPLE 15-MINUTE n8n Setup

## **STEP 1: Setup n8n (3 minutes)**
1. Go to **n8n.cloud** → Sign up (free)
2. Create workspace  
3. Copy webhook URL: `https://yourname.app.n8n.cloud/webhook/test`

## **STEP 2: Deploy Your App (2 minutes)**
```bash
npm run build
vercel --prod
```
Get your URL: `https://your-app.vercel.app`

## **STEP 3: Create Simple Workflow in n8n (5 minutes)**

### In n8n Dashboard:
1. **Click "New Workflow"**
2. **Add these 3 nodes:**

#### **Node 1: Schedule Trigger**
- Search: "Schedule Trigger"
- Set: Every day at 9 AM
- Cron: `0 9 * * *`

#### **Node 2: HTTP Request**  
- Search: "HTTP Request"
- URL: `https://your-app.vercel.app/api/simple-notify`
- Method: POST
- Body (JSON):
```json
{
  "email": "your-email@gmail.com",
  "message": "🍳 Good morning! Time to plan your healthy meals today!"
}
```

#### **Node 3: Gmail (Optional)**
- Search: "Gmail"
- Connect your Gmail
- To: `your-email@gmail.com`
- Subject: `Daily Recipe Reminder`
- Message: `🍳 Your daily cooking reminder is here!`

### **Connect the nodes:** Trigger → HTTP Request → Gmail

## **STEP 4: Test (2 minutes)**
1. Click **"Execute Workflow"**
2. Check if you receive notification
3. Click **"Activate"** to make it run daily

## **STEP 5: Add More Reminders (3 minutes)**

### **Create 2nd Workflow - Water Reminder:**
1. **New Workflow**
2. **Schedule Trigger**: `0 */3 * * *` (every 3 hours)
3. **HTTP Request**: 
```json
{
  "email": "your-email@gmail.com", 
  "message": "💧 Hydration reminder! Drink water for better health!"
}
```

### **Create 3rd Workflow - Evening Meal Prep:**
1. **New Workflow**  
2. **Schedule Trigger**: `0 18 * * *` (6 PM daily)
3. **HTTP Request**:
```json
{
  "email": "your-email@gmail.com",
  "message": "🍽️ Dinner time! Check your recipe app for tonight's meal!"
}
```

## **🎯 What You Get:**
- ✅ **9 AM**: Daily meal planning reminder
- ✅ **Every 3 hours**: Water intake reminders  
- ✅ **6 PM**: Dinner preparation reminder
- ✅ **Automated emails** sent to your inbox
- ✅ **Zero maintenance** - runs automatically

## **🚀 Advanced (Optional - 5 more minutes):**

### **Add User Data:**
Replace static email with dynamic data:

1. **Add Webhook node** instead of Schedule
2. **Call from your app:**
```javascript
// In your React app
fetch('https://yourname.app.n8n.cloud/webhook/test', {
  method: 'POST',
  body: JSON.stringify({
    email: user.email,
    name: user.name,
    preferences: user.dietary_preferences
  })
})
```

3. **Use dynamic data in HTTP Request:**
```json
{
  "email": "{{ $json.email }}",
  "message": "Hi {{ $json.name }}! Here's your {{ $json.preferences }} meal plan!"
}
```

## **✅ DONE! Total Time: 15 minutes**

Your automation is now running 24/7:
- **Daily meal reminders**
- **Health notifications** 
- **Automated user engagement**
- **Zero code maintenance**

**Test it:** Wait for 9 AM tomorrow or manually execute the workflow! 🎉