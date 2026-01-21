# 🚀 Step-by-Step n8n Implementation Guide

## **STEP 1: Set Up n8n (5 minutes)**

### Option A: n8n Cloud (Recommended)
1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for free account
3. Create new workspace
4. Copy your webhook URL: `https://your-instance.app.n8n.cloud/webhook/`

### Option B: Local Setup
```bash
npx n8n
# Opens at http://localhost:5678
```

## **STEP 2: Configure Supabase Tables (10 minutes)**

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and paste the SQL from `supabase_automation_tables.sql`
4. Click "Run" to create all tables

## **STEP 3: Update Environment Variables (2 minutes)**

Your `.env.local` is already updated with:
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/
N8N_API_KEY=your-n8n-api-key
SENDGRID_API_KEY=your-sendgrid-key
```

**Replace with your actual values!**

## **STEP 4: Deploy Your App (5 minutes)**

```bash
npm run build
npm run start
# Or deploy to Vercel
```

Get your app URL: `https://your-app.vercel.app`

## **STEP 5: Create First n8n Workflow (15 minutes)**

### In n8n Dashboard:

1. **Click "New Workflow"**
2. **Import JSON**: Copy content from `n8n_workflows/daily_meal_plan.json`
3. **Update URLs**:
   - Replace `https://your-app.vercel.app` with your actual URL
   - Replace Supabase keys with your actual keys

### Configure Nodes:

#### **Node 1: Cron Trigger**
- Type: `Cron`
- Expression: `0 7 * * *` (7 AM daily)

#### **Node 2: Get Users**
- Type: `HTTP Request`
- URL: `https://zwtkkgywznvfbejhbclv.supabase.co/rest/v1/user_preferences`
- Headers: 
  - `Authorization: Bearer YOUR_SERVICE_KEY`
  - `apikey: YOUR_ANON_KEY`

#### **Node 3: Generate Meal Plan**
- Type: `HTTP Request`
- URL: `https://your-app.vercel.app/api/n8n/user-automation`
- Method: `POST`
- Body: 
```json
{
  "type": "daily_meal_plan",
  "userId": "{{ $json.user_id }}",
  "data": {
    "dietary_preferences": "{{ $json.dietary_preferences }}"
  }
}
```

#### **Node 4: Send Email**
- Type: `Email Send`
- Configure your email provider (Gmail/SendGrid)

## **STEP 6: Test the Workflow (5 minutes)**

1. **Add Test User Data**:
```sql
INSERT INTO user_preferences (user_id, dietary_preferences, notifications_enabled)
VALUES ('your-user-id', '{"vegetarian", "low-carb"}', true);
```

2. **Manual Test**: Click "Execute Workflow" in n8n
3. **Check Results**: Verify email is sent and data is saved

## **STEP 7: Create Health Reminders Workflow (10 minutes)**

### Create New Workflow:

```json
{
  "name": "Health Reminders",
  "nodes": [
    {
      "name": "Water Reminder",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "rule": { "cronExpression": "0 9,12,15,18 * * *" }
      }
    },
    {
      "name": "Send Reminder",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://your-app.vercel.app/api/n8n/user-automation",
        "method": "POST",
        "body": {
          "type": "health_reminder",
          "data": { "reminderType": "water" }
        }
      }
    }
  ]
}
```

## **STEP 8: Set Up Email Provider (10 minutes)**

### Option A: Gmail
1. Enable 2FA on Gmail
2. Generate App Password
3. Add to n8n credentials:
   - Email: `your-email@gmail.com`
   - Password: `your-app-password`

### Option B: SendGrid
1. Sign up at SendGrid
2. Create API key
3. Add to n8n credentials

## **STEP 9: Monitor & Scale (Ongoing)**

### Check Workflow Execution:
1. Go to n8n "Executions" tab
2. Monitor success/failure rates
3. Check logs for errors

### Add More Workflows:
- Weekly shopping lists
- Ingredient alerts
- Feedback processing
- Nutrition reports

## **STEP 10: Production Checklist**

### ✅ **Before Going Live:**
- [ ] All environment variables set
- [ ] Database tables created
- [ ] Workflows tested manually
- [ ] Email provider configured
- [ ] Error handling added
- [ ] User permissions set

### ✅ **Monitoring Setup:**
- [ ] n8n execution logs
- [ ] Email delivery rates
- [ ] User engagement metrics
- [ ] API response times

## **🎯 Quick Start Commands**

```bash
# 1. Install dependencies
npm install

# 2. Set up database
# Run supabase_automation_tables.sql in Supabase

# 3. Update environment variables
# Edit .env.local with your keys

# 4. Deploy app
vercel --prod

# 5. Import n8n workflow
# Copy daily_meal_plan.json to n8n

# 6. Test workflow
# Execute manually in n8n dashboard
```

## **🔧 Troubleshooting**

### Common Issues:
1. **Workflow not triggering**: Check cron expression
2. **API errors**: Verify environment variables
3. **Email not sending**: Check email provider credentials
4. **Database errors**: Verify Supabase permissions

### Debug Steps:
1. Test API endpoint manually
2. Check n8n execution logs
3. Verify database connections
4. Test email sending separately

## **🚀 You're Ready!**

Your automation system is now set up to:
- ✅ Send daily meal plans at 7 AM
- ✅ Send health reminders throughout the day
- ✅ Process user feedback automatically
- ✅ Generate shopping lists weekly

**Total setup time: ~1 hour**
**Result: 24/7 automated user engagement!** 🤖✨