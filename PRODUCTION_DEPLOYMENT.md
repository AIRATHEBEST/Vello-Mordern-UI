# Production Deployment Guide - Vello AI Intelligence OS

This guide covers deploying the Vello AI Intelligence OS to production using Vercel, Netlify, or Docker.

---

## Prerequisites

- GitHub repository: https://github.com/AIRATHEBEST/Vello-Mordern-UI
- Supabase project: VELLO MORDERN UI (oredszasbvkvejvbooki)
- Supabase Anon Key (from project settings)

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose: `AIRATHEBEST/Vello-Mordern-UI`
4. Click "Import"

### Step 2: Configure Environment Variables

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

```
VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://vello-mordern-ui.vercel.app`

### Step 4: Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as shown

---

## Option 2: Deploy to Netlify

### Step 1: Connect GitHub Repository

1. Go to https://app.netlify.com/start
2. Select "Connect to Git"
3. Choose GitHub
4. Select: `AIRATHEBEST/Vello-Mordern-UI`

### Step 2: Configure Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Step 3: Set Environment Variables

1. Click "Advanced"
2. Add environment variables:
   - `VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here`

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Your app will be live at: `https://vello-mordern-ui.netlify.app`

---

## Option 3: Deploy with Docker

### Step 1: Build Docker Image

```bash
# Clone the repository
git clone https://github.com/AIRATHEBEST/Vello-Mordern-UI.git
cd Vello-Mordern-UI

# Build the Docker image
docker build -t vello-ai-os:latest .
```

### Step 2: Run Locally

```bash
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here \
  vello-ai-os:latest
```

App will be available at: `http://localhost:3000`

### Step 3: Deploy to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag vello-ai-os:latest yourusername/vello-ai-os:latest

# Push to Docker Hub
docker push yourusername/vello-ai-os:latest
```

### Step 4: Deploy to Cloud Services

#### AWS ECS
```bash
# Create ECS cluster and service
aws ecs create-cluster --cluster-name vello-ai
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster vello-ai --service-name vello-app --task-definition vello-app --desired-count 1
```

#### Google Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/vello-ai-os

# Deploy to Cloud Run
gcloud run deploy vello-ai-os \
  --image gcr.io/PROJECT_ID/vello-ai-os \
  --platform managed \
  --region us-central1 \
  --set-env-vars VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co,VITE_SUPABASE_ANON_KEY=your_key
```

#### Azure Container Instances
```bash
# Build and push to Azure Container Registry
az acr build --registry myregistry --image vello-ai-os:latest .

# Deploy to ACI
az container create \
  --resource-group mygroup \
  --name vello-app \
  --image myregistry.azurecr.io/vello-ai-os:latest \
  --environment-variables VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=...
```

---

## Option 4: Deploy with Docker Compose

### Step 1: Set Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Start Services

```bash
docker-compose up -d
```

App will be available at: `http://localhost:3000`

### Step 3: Stop Services

```bash
docker-compose down
```

---

## Supabase Configuration

### Get Your Anon Key

1. Go to https://app.supabase.com
2. Select your project: "VELLO MORDERN UI"
3. Go to **Settings → API**
4. Copy the "anon" key (public key)

### Database Connection

The app automatically connects to Supabase using the anon key. No additional configuration needed.

---

## Monitoring & Maintenance

### Vercel Monitoring

- **Analytics:** Dashboard → Analytics
- **Logs:** Dashboard → Functions
- **Performance:** Dashboard → Performance

### Netlify Monitoring

- **Build logs:** Deploys → Build log
- **Function logs:** Functions → Logs
- **Analytics:** Analytics

### Docker Monitoring

```bash
# View logs
docker logs vello-ai-os

# Check resource usage
docker stats vello-ai-os

# SSH into container
docker exec -it vello-ai-os /bin/sh
```

---

## Troubleshooting

### Build Fails

**Problem:** Build fails with "VITE_SUPABASE_ANON_KEY not found"

**Solution:**
1. Check environment variables are set in deployment platform
2. Verify variable names match exactly: `VITE_SUPABASE_ANON_KEY`
3. Redeploy after adding variables

### App Shows Blank Page

**Problem:** App loads but shows blank page

**Solution:**
1. Check browser console for errors (F12)
2. Verify Supabase URL and key are correct
3. Check network tab for failed requests
4. Verify CORS is enabled in Supabase

### Database Connection Fails

**Problem:** "Failed to connect to Supabase"

**Solution:**
1. Verify Supabase project is ACTIVE (not paused)
2. Check anon key is correct
3. Verify database tables exist (check Supabase dashboard)
4. Check RLS policies are configured

---

## Performance Optimization

### Build Size

Current build size: ~455KB JS, ~36KB CSS (gzipped)

To optimize further:
```bash
# Analyze bundle
npm run build -- --analyze

# Tree-shake unused code
npm run build -- --minify terser
```

### Caching

- Static assets cached for 1 year
- HTML cached for 0 seconds (always fresh)
- API responses cached client-side with Zustand

### CDN

Both Vercel and Netlify automatically use CDN for static assets.

---

## Security

### Environment Variables

- Never commit `.env.local` to git
- Use `.env.example` for documentation
- Rotate Supabase keys regularly

### CORS

CORS is configured in Supabase to allow requests from:
- `localhost:3000`
- `localhost:3001`
- `*.vercel.app`
- `*.netlify.app`

### SSL/TLS

All deployments use HTTPS by default.

---

## Rollback

### Vercel

1. Go to Deployments
2. Click the previous deployment
3. Click "Redeploy"

### Netlify

1. Go to Deploys
2. Click the previous deploy
3. Click "Publish deploy"

### Docker

```bash
# Switch to previous image
docker run -p 3000:3000 vello-ai-os:previous
```

---

## Support

For issues or questions:

1. Check GitHub Issues: https://github.com/AIRATHEBEST/Vello-Mordern-UI/issues
2. Review Supabase Docs: https://supabase.com/docs
3. Check Vercel/Netlify Docs for deployment-specific issues

---

## Next Steps

1. ✅ Deploy to production
2. Set up custom domain
3. Configure analytics
4. Set up monitoring/alerts
5. Plan scaling strategy
