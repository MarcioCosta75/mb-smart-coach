# 📘 MB Smart Coach

## 👥 Team Members
- **Márcio Costa** - Matriculation Number: 5022976
- **Sukaina Sukaina** - Matriculation Number: 5023216
- **Hannes Romer** - Matriculation Number: 5014032
- **Lorenz Humls** - Matriculation Number: 5011174

## 🧠 Overview
MB Smart Coach is an intelligent, proactive assistant designed specifically for the Mercedes-Benz EV Smart Charging ecosystem.

More than just a chatbot, the Smart Coach is a **smart digital companion** that understands your lifestyle, learns from your habits, and anticipates your charging needs.

### 🎭 Designed for "Effortless Ella"
The Smart Coach was built with a specific user in mind:
- **Ella, 29**, freelance architect in Stuttgart, Germany
- Works from home with hybrid setup
- Has home solar panels + Mercedes wallbox
- Drives a Mercedes EQS SUV
- Values technology that works seamlessly without constant planning

### 🧩 Core Concept: Proactive Intelligence
The Smart Coach doesn't wait for you to ask - it **anticipates and acts**:

- **🌅 Morning check**: Automatically checks if vehicle is plugged in at 7:00 AM
- **📅 Calendar sync**: Detects last-minute meetings and adjusts charging *(planned)*
- **☀️ Real-time solar optimization**: Monitors solar radiation and cloud cover
- **⚡ Dynamic energy pricing**: Integrates real-time rates (EUR/kWh) from Stuttgart
- **🔋 Proactive battery management**: Prevents range anxiety with smart alerts

### 💡 Design Philosophy: "Elegant, Smart, Useful"
Following Mercedes-Benz DNA, the Smart Coach combines:
- **Elegance** - Refined interface and smooth interactions
- **Intelligence** - AI that understands context and preferences
- **Utility** - Practical solutions for real-world scenarios

## 🎯 Problem Statement
Many EV users do not fully understand how smart charging works.
This leads to frustration, loss of trust, or users disabling smart features entirely.
There's a clear need for support that:

- Is contextual and non-intrusive
- Builds trust progressively
- Maintains user control

## 💡 Our Solution: Smart Multi-Layer Architecture

### 🎯 Layer 1: Contextual Intelligence
- **AI Conversation Engine**: OpenAI integration with Mercedes personality
- **Pattern Learning**: Understands user routines and preferences
- **Need Prediction**: Anticipates scenarios before they happen

### ⚡ Layer 2: Real-Time Data Integration
- **Weather API**: Solar radiation and climate conditions
- **Google Calendar**: Automatic appointment synchronization *(planned future feature)*
- **Energy Pricing**: Dynamic rates from German power grid
- **Vehicle Status**: Battery level, range, location

### 🌟 Layer 3: Adaptive Interface
- **Smart Chat**: Natural conversations with context memory
- **Voice Control**: Hands-free interaction for in-vehicle use
- **Proactive Notifications**: Contextual alerts at the right time
- **Visual Dashboard**: Charging schedules and insights

## 📋 Key Features

### 🤖 Smart AI Assistant
✅ **Personalized conversations** with context memory  
✅ **Natural language** understanding and responses  
✅ **Smart welcome messages** with real-time vehicle data  
✅ **Adaptive behavior** based on user preferences  

### 🌞 Solar Optimization
✅ **Real-time weather monitoring** for solar potential  
✅ **Best charging windows** for clean energy use  
✅ **Cloud prediction** to anticipate solar changes  
✅ **Mercedes wallbox integration** for direct control  

### 📅 Proactive Scheduling
🔄 **Google Calendar sync** for automatic appointment detection *(planned)*  
🔄 **Last-minute alerts** for unexpected meetings *(planned)*  
✅ **Daily morning checks** at 7:00 AM automatically  
✅ **Adaptive scheduling** that adjusts to changes  

### 🎤 Multi-Modal Interaction
✅ **Voice control** with speech recognition and synthesis  
✅ **Visual chat interface** with Mercedes design language  
✅ **Smart notifications** with schedule and alerts drawer  
✅ **Hands-free mode** perfect for in-vehicle use  

### 💰 Cost Optimization
✅ **Dynamic energy pricing** from Stuttgart grid in real-time  
✅ **Off-peak charging** to maximize savings  
✅ **Monthly reports** showing € and CO₂ savings  
✅ **Scenario comparison** for different charging strategies  

## 🎬 Smart Usage Scenarios

### 🌅 Scenario 1: "Forgot to Plug In" *(Future with Calendar Integration)*
```
07:00 - Smart Coach detects unplugged vehicle
07:02 - "Good morning, Ella! Your EQS is at 22% battery. 
         I see you have a meeting at the office at 1:00 PM. 
         Can I optimize charging with today's sunshine?"
07:05 - Auto-schedule: Solar charging 11:00-13:00
```

### ☀️ Scenario 2: "Dynamic Solar Optimization" *(Future with Calendar Integration)*
```
10:45 - Calendar updated: Last-minute meeting
10:47 - "I detected a new meeting. Adjusting charging...
         Switching to fast mode: using solar peak 11:00-12:30"
11:00 - Charging started automatically
```

### 🔋 Scenario 3: "Range Anxiety Prevention"
```
Battery: 45% → Destination: 120km (round trip)
"Ella, for today's meeting, I recommend charging to 65%.
 With current weather conditions, this ensures 15% safety margin.
 Can I schedule for 2:00 PM?"
```

## 🔍 Backed By Research
User interviews showed a lack of confidence and need for guidance

Academic research recommends progressive disclosure and contextual transparency

Interview quotes directly validated the need for onboarding, simplicity, and trust-building

> *"If I don't understand what it's doing, I'll just assume it's broken."*

> *"Don't give me too many options at once."*

> *"It should know I need the car by 7AM."*

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Component library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI

### Backend & APIs
- **Next.js API Routes** - Server-side API endpoints
- **Google Calendar API** - Calendar integration *(planned)*
- **Weather API** - Weather data integration
- **AI Integration** - Chat and voice assistance

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **PNPM** - Package manager

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- PNPM (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/mb-smart-coach.git
   cd mb-smart-coach
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required API keys and configuration values.

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables
You'll need to configure the following environment variables:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID *(for future calendar integration)*
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret *(for future calendar integration)*
- `WEATHER_API_KEY` - Weather service API key
- `AI_API_KEY` - AI service API key

## 📐 Prototype
The interactive prototype includes:

- Onboarding screens
- In-app tips and explanations
- Help interface for decision points
- Voice interaction demos
- Smart charging scenarios

## 🤖 AI Collaboration Log
Used multiple LLMs (ChatGPT, Claude, Gemini, etc.) to:

- Generate ideas
- Critique design directions
- Match interview data to features
- Write copy for interface text
- Develop conversation flows for the smart coach

**Example Prompt:**
> *"Design a smart charging assistant that explains actions and supports onboarding for new EV users while maintaining user autonomy and building trust progressively."*

## 🧠 Smart Coach Architecture

### 🔗 How It Works
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Real-time Data │───▶│                  │───▶│   AI Decisions  │
│     (APIs)      │    │   Smart Coach    │    │  & Suggestions  │
└─────────────────┘    │   AI Engine      │    └─────────────────┘
┌─────────────────┐───▶│                  │───▶┌─────────────────┐
│ User Profile &  │    │  (OpenAI GPT)    │    │ Proactive Actions│
│    History      │    │                  │    │  & Notifications │
└─────────────────┘    └──────────────────┘    └─────────────────┘
┌─────────────────┐───▶                    ───▶┌─────────────────┐
│ Vehicle Status  │                             │ Adaptive UI     │
│  & Location     │                             │ (Voice + Chat)  │
└─────────────────┘                             └─────────────────┘
```

### ⚡ Processing Flow
```typescript
// Step 1: Collect Context
const context = {
  vehicle: { battery: "74%", range: "504km", location: "Stuttgart" },
  weather: { solar: "850W/m²", clouds: "20%", temp: "16°C" },
  calendar: { nextMeeting: "13:00 - HQ Office" },
  energy: { current: "0.32€/kWh", offPeak: "0.18€/kWh" }
}

// Step 2: AI Analysis
const aiDecision = await smartCoach.analyze(context, userHistory)

// Step 3: Proactive Action
const actions = generateProactiveActions(aiDecision)
```

## 🏗️ Project Structure

```
mb-smart-coach/
├── app/
│   ├── api/
│   │   ├── chat/           # AI conversation engine
│   │   ├── voice/          # Voice processing
│   │   ├── weather/        # Weather integration
│   │   └── calendar/       # Google Calendar sync (planned)
│   └── smart-coach/        # Main Coach interface
├── components/
│   ├── smart-coach-drawer/ # Contextual dashboard
│   ├── chat-area/          # Smart chat interface
│   ├── voice-button/       # Voice control
│   └── ui/                 # Mercedes design system
├── lib/
│   ├── smart-coach-api.ts  # Contextual AI core
│   ├── weather-api.ts      # Solar optimization
│   └── ai-config.ts        # OpenAI configuration
└── hooks/
    ├── use-voice-chat.ts   # Voice interaction hook
    └── use-persistent-chat.ts # Conversation memory
```

## 🔄 Key Components

### 🎭 Smart Coach Drawer
- **Dynamic schedule** that adapts automatically to changes
- **Smart notifications** based on weather, calendar, and energy  
- **Mercedes design** reflecting premium visual identity
- **Smooth animations** with custom timing functions

### 💬 Chat Area
- **Context memory** remembers previous conversations and preferences
- **Personalized welcome** messages with real-time data
- **Smart auto-scroll** follows the conversation naturally
- **Voice integration** for complete multimodal interaction

### 🎤 Voice Button
- **Speech-to-text** with accurate local processing
- **Text-to-speech** with natural voice synthesis
- **Visual feedback** during recording and processing
- **Error recovery** with smart audio failure handling

### 📊 Vehicle Status
- **Real-time data** for battery, range, and location
- **Need prediction** anticipates range issues
- **Wallbox integration** for direct charging control
- **Proactive alerts** before critical situations

### 📅 Calendar Integration *(Future Feature)*
- **Google sync** for automatic schedule access *(planned)*
- **Change detection** alerts for last-minute appointments *(planned)*
- **Route calculation** estimates consumption based on destinations *(planned)*
- **Time optimization** adjusts charging based on schedules

## 🏆 What Makes It Special

### 🎯 Beyond Traditional Chatbots
MB Smart Coach isn't just another virtual assistant. It's a **smart digital companion** that stands out by:

#### 🧠 **Deep Contextual Intelligence**
- Understands your **lifestyle**, not just commands
- **Learns patterns** and anticipates needs before they're expressed
- **Defined personality** (Ella) that creates emotional connection

#### ⚡ **Smart Proactivity**
- **Acts without being asked**: Automatic morning checks
- **Scenario prediction**: "What if you forget to charge today?"
- **Real-time adaptation**: Adjusts plans based on external changes

#### 🌍 **Complete Ecosystem Integration**
- **Multi-API**: Weather + Calendar + Energy + Vehicle simultaneously
- **Holistic decisions**: Considers all factors together
- **Complex optimization**: Solar + grid + time + cost + need

#### 🎭 **Real User-Centered Design**
- **Specific persona**: Built for Ella, not "everyone"
- **Real scenarios**: Based on daily German situations
- **Location-specific**: Stuttgart, solar panels, Mercedes wallbox

### 🌟 **Mercedes Digital DNA**
- **Elegance**: Premium interface reflecting brand values
- **Precision**: Reliable information and smart decisions
- **Innovation**: Cutting-edge technology with clear purpose

## ✨ Future Improvements
- [ ] **Google Calendar Integration** - Automatic appointment detection and charging optimization
- [ ] **Last-minute Meeting Alerts** - Proactive notifications for schedule changes
- [ ] Test with real users for tone and timing
- [ ] Add voice support for in-car interaction
- [ ] Implement machine learning for personalized recommendations
- [ ] Add multilingual support
- [ ] Enhance accessibility features
- [ ] Integrate with more smart home systems

## 📊 Research Methodology
- **User Interviews**: Conducted with 15+ EV owners
- **Competitive Analysis**: Reviewed existing smart charging solutions
- **Literature Review**: Academic research on trust in automation
- **Prototype Testing**: Iterative design validation

## 🎨 Design Principles
1. **Progressive Disclosure** - Information revealed when needed
2. **User Control** - Always maintain user autonomy
3. **Contextual Relevance** - Tips and guidance at the right moment
4. **Trust Building** - Clear explanations of automated actions
5. **Non-intrusive** - Helpful without being overwhelming

## 📈 Success Metrics
- User engagement with smart charging features
- Reduction in smart charging opt-outs
- User confidence scores
- Task completion rates
- Feature adoption metrics

## 🤝 Contributing
This project was developed as part of an academic program. For questions or collaboration opportunities, please contact the team members listed above.

## 📄 License
This project is part of academic coursework. All rights reserved to the team members and academic institution.

---

*Built with ❤️ by Team 1* 