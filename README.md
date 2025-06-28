# 🌺 Poppy - AI Healthcare Companion for the Elderly





## 🏥 Overview

**Poppy** is a AI-powered healthcare companion designed specifically for elderly individuals living independently. Our mission is simple yet profound: ensure that no elderly person ever misses their medication, forgets their appointments, or faces a health emergency alone.

### 🎯 The Problem We Solve

Millions of elderly individuals live alone and struggle with:
- **Medication Management** - Missing doses, confusion about prescriptions
- **Appointment Tracking** - Forgetting checkups and follow-ups  
- **Health Monitoring** - Lack of continuous health assessment
- **Emergency Response** - No immediate access to medical help
- **Vision Challenges** - Difficulty reading prescription labels

### 💡 Our Solution

Poppy transforms healthcare management through intelligent automation, providing a comprehensive ecosystem that bridges the gap between elderly patients, their caregivers, and healthcare providers.

---

## ✨ Key Features

### 🗣️ **AI Voice Assistant**
- **Natural Conversations**: Powered by advanced AI models for human-like interactions
- **Health Assessment**: Conducts preliminary diagnostics through voice conversations
- **24/7 Availability**: Always ready to listen and help

### 📋 **Smart Appointment Management**
- **Automatic Booking**: AI agent schedules appointments directly with healthcare providers
- **Calendar Integration**: Seamlessly adds appointments to patient calendars
- **Traffic-Aware Reminders**: Provides location and timing based on real-time traffic
- **Multi-Party Notifications**: Keeps patients, caregivers, and doctors informed

### 💊 **Intelligent Medication Management**
- **Voice Reminders**: Personal medication calls at prescribed times
- **Vision Assistance**: AI-powered prescription reading for visually impaired users
- **Pattern Tracking**: Monitors medication adherence and reports to healthcare providers
- **Emergency Escalation**: Alerts caregivers if medications are missed

### 🚨 **Emergency Response System**
- **SOS Video Calls**: Instant video connection to healthcare providers
- **First Aid Guidance**: Real-time medical assistance until help arrives
- **Caregiver Alerts**: Immediate notifications to emergency contacts

### 👁️ **AI Vision Technology**
- **Prescription Reading**: Identifies medications from photos
- **Dosage Verification**: Ensures correct medication and timing
- **Visual Assistance**: Provides audio descriptions of medicine labels

---

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - Modern React framework with server-side rendering
- **TypeScript** - Type-safe development
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Responsive, modern styling

### **Backend & AI**
- **Python** - Core backend services and AI integration
- **OpenAI GPT** - Advanced natural language processing
- **Google Gemini 2.5** - Health assessment and diagnostic support
- **ElevenLabs** - Premium AI voice generation and calling

### **Infrastructure & Services**
- **AWS** - Scalable cloud hosting and services  
- **Supabase** - Real-time database and authentication
- **Twilio** - Voice calling and SMS notifications
- **Custom APIs** - Healthcare provider integrations

### **Security & Compliance**
- **End-to-End Encryption** - Secure patient information handling
- **Role-Based Access Control** - Granular permission management

---

## 🚀 Getting Started

### Prerequisites
```bash
- Node.js 18+ 
- Python 3.8+
- AWS Account
- Supabase Project
- Twilio Account
- OpenAI API Key
- Google Cloud Account (for Gemini)
- ElevenLabs API Key
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aibelbin/poppy
cd poppy
```

2. **Frontend Setup**
```bash
npm install
cp .env.example .env.local
# Add your environment variables
npm run dev
```

3. **Backend Setup**
```bash
pip install -r requirements.txt
cp .env.example .env
# Configure your API keys and database
python app.py
```

4. **Environment Variables**
```env
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Backend (.env)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
ELEVENLABS_API_KEY=your_elevenlabs_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

---

## 📱 How It Works

### 1. **Registration & Assessment**
- New users register through our intuitive interface
- Gemini AI conducts comprehensive health assessment
- Medical history and preferences are securely stored

### 2. **AI Health Consultation**
- Patients call Poppy when experiencing discomfort
- AI voice agent conducts detailed health interview
- Preliminary diagnosis generated and shared with healthcare providers

### 3. **Seamless Appointment Booking**
- ElevenLabs AI agent contacts healthcare providers
- Appointments automatically scheduled and confirmed
- Calendar events created with all relevant details

### 4. **Continuous Care Management**
- Daily medication reminders via personalized voice calls
- Vision assistance for prescription identification
- Pattern tracking and caregiver notifications

### 5. **Follow-up & Monitoring**
- Automatic scheduling of follow-up appointments
- Health pattern analysis for doctors
- Continuous improvement of care recommendations

---

## 🎨 User Experience

### For Elderly Patients
- **Simple Voice Interface** - No complex navigation required
- **Personalized Experience** - AI learns individual preferences and patterns
- **Multilingual Support** - Communicates in preferred language
- **Large, Clear Visuals** - Designed for visual accessibility

### For Caregivers
- **Real-time Notifications** - Stay informed about medication and appointments
- **Health Reports** - Comprehensive insights into patient wellbeing
- **Emergency Alerts** - Immediate notification of health concerns

### For Healthcare Providers
- **Pre-visit Summaries** - AI-generated patient reports before appointments
- **Medication Compliance** - Detailed adherence tracking
- **Seamless Integration** - Works with existing healthcare systems

---
