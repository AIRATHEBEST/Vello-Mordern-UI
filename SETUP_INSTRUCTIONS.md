# Vello AI Intelligence OS - Complete Setup Instructions

Welcome! This is a production-ready AI Intelligence Operating System overlay for Vello.ai. Follow these instructions to get everything running.

---

## 🚀 Quick Start (5 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/AIRATHEBEST/Vello-Mordern-UI.git
cd Vello-Mordern-UI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

Open http://localhost:3001 in your browser.

---

## 📊 Getting Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select project: **VELLO MORDERN UI**
3. Click **Settings** → **API**
4. Copy the **anon** key (public key)
5. Paste into `.env.local`

---

## 🎯 What's Included

### Core Features
- ✅ 30 AI models classified by TRUE capabilities
- ✅ Intelligent intent detection
- ✅ 6 specialized interfaces (reasoning, coding, research, creative, vision, fast)
- ✅ 8 cognitive augmentation tools
- ✅ 7 cognitive modes (Architect, Lawyer, Investor, Researcher, Engineer, Systems Thinker, Philosopher)
- ✅ Multi-model orchestration pipelines
- ✅ Real Supabase backend integration
- ✅ Production-ready deployment configs

### Database
- Models table (30 AI models)
- Conversations table (user conversations)
- Messages table (conversation messages)
- User preferences table
- Orchestration pipelines table
- Pipeline executions table
- Cognitive tools usage table

---

## 📁 Project Structure

```
vello-overlay-app/
├── src/
│   ├── lib/
│   │   ├── models-database.ts       # 30 models with capabilities
│   │   ├── intent-router.ts         # Intent detection engine
│   │   ├── orchestration-engine.ts  # Multi-model pipelines
│   │   ├── mode-system.ts           # 7 cognitive modes
│   │   └── supabase.ts              # Supabase client & API
│   ├── store/
│   │   └── overlayStore.ts          # Zustand state management
│   ├── components/
│   │   ├── Header.tsx               # Intent detector
│   │   ├── ModelSelector.tsx        # Model browser
│   │   ├── ModeSelector.tsx         # Cognitive mode switcher
│   │   ├── CognitiveTools.tsx       # Augmentation tools
│   │   ├── SpecializedInterface.tsx # Router
│   │   └── interfaces/
│   │       ├── ReasoningInterface.tsx
│   │       ├── CodingInterface.tsx
│   │       ├── ResearchInterface.tsx
│   │       ├── CreativeInterface.tsx
│   │       ├── VisionInterface.tsx
│   │       └── FastInterface.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── migrations/
│       └── 001_create_schema.sql    # Database schema
├── .env.example                      # Environment template
├── .env.local                        # Your local config (gitignored)
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS config
├── manifest.json                    # Extension manifest
├── Dockerfile                       # Docker configuration
├── docker-compose.yml               # Docker Compose config
├── vercel.json                      # Vercel deployment config
├── netlify.toml                     # Netlify deployment config
├── README.md                        # Full documentation
├── DEPLOYMENT.md                    # Deployment guide
├── PRODUCTION_DEPLOYMENT.md         # Production deployment
└── SETUP_INSTRUCTIONS.md            # This file
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Build browser extension
./build-extension.sh

# Check TypeScript
npm run check

# Format code
npm run format
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Easiest)

1. Go to https://vercel.com/new
2. Import GitHub repository: `AIRATHEBEST/Vello-Mordern-UI`
3. Add environment variables:
   - `VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=your_key`
4. Click Deploy
5. Live at: `https://vello-mordern-ui.vercel.app`

### Option 2: Netlify

1. Go to https://app.netlify.com/start
2. Connect GitHub: `AIRATHEBEST/Vello-Mordern-UI`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables (same as Vercel)
6. Deploy
7. Live at: `https://vello-mordern-ui.netlify.app`

### Option 3: Docker

```bash
# Build image
docker build -t vello-ai-os:latest .

# Run locally
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://oredszasbvkvejvbooki.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  vello-ai-os:latest

# Or use Docker Compose
docker-compose up -d
```

See `PRODUCTION_DEPLOYMENT.md` for detailed instructions.

---

## 🔌 Browser Extension

### Build Extension

```bash
./build-extension.sh
```

Output: `dist-extension/`

### Install Locally

**Chrome/Edge:**
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist-extension/` folder

**Firefox:**
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

### Publish to App Stores

- **Chrome Web Store:** https://chrome.google.com/webstore/devconsole
- **Firefox Add-ons:** https://addons.mozilla.org/developers/
- **Edge Add-ons:** https://partner.microsoft.com/en-us/dashboard/microsoftedge

---

## 🔐 Security & Best Practices

### Environment Variables
- Never commit `.env.local` to git
- Use `.env.example` for documentation
- Rotate Supabase keys regularly

### Database Security
- Row-level security (RLS) enabled on all tables
- Users can only see their own data
- Models are public read-only

### CORS
Configured to allow requests from:
- `localhost:3000`, `localhost:3001`
- `*.vercel.app`
- `*.netlify.app`

---

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Supabase Connection Fails
1. Verify project is ACTIVE (not paused)
2. Check anon key is correct
3. Verify database tables exist
4. Check RLS policies are configured

### Build Fails
1. Check Node version: `node --version` (should be 18+)
2. Clear build cache: `rm -rf dist node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

### Extension Not Loading
1. Check `manifest.json` is valid JSON
2. Ensure `dist-extension/` folder exists
3. Try incognito mode (Chrome)
4. Check browser console for errors

---

## 📚 Documentation

- **README.md** - Full feature overview
- **DEPLOYMENT.md** - Deployment guide
- **PRODUCTION_DEPLOYMENT.md** - Production deployment details
- **Code comments** - Inline documentation

---

## 🎓 Learning Resources

### Vello.ai
- Website: https://vello.ai
- Docs: https://docs.vello.ai

### Supabase
- Website: https://supabase.com
- Docs: https://supabase.com/docs

### React & TypeScript
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Deployment
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Docker: https://docs.docker.com

---

## 🤝 Support

### Issues & Questions
1. Check GitHub Issues: https://github.com/AIRATHEBEST/Vello-Mordern-UI/issues
2. Review documentation above
3. Check browser console for errors (F12)

### Reporting Bugs
Include:
- Browser and OS
- Steps to reproduce
- Expected vs actual behavior
- Browser console errors
- Screenshots if applicable

---

## 🚀 Next Steps

1. ✅ Clone repository
2. ✅ Install dependencies
3. ✅ Set up environment variables
4. ✅ Start dev server
5. ⬜ Test the app locally
6. ⬜ Deploy to Vercel/Netlify
7. ⬜ Build browser extension
8. ⬜ Publish to app stores

---

## 📝 License

MIT License - Feel free to use, modify, and distribute.

---

## 🎉 You're All Set!

Your Vello AI Intelligence OS is ready to use. Start with:

```bash
npm run dev
```

Then open http://localhost:3001 and start exploring!

Happy coding! 🚀
