# blastX - SaaS AI Consultation Platform

> An end-to-end SaaS platform that bridges the gap between real-time video communication and generative AI, providing automated meeting intelligence and personalized AI consultation.

Instead of just recording meetings, **blastX** acts as an intelligent layer that: 
**Streams high-fidelity video** -> **Processes transcripts via background jobs** -> **Synthesizes actionable AI insights.**

## Key Features
- **Real-Time Video Infrastructure:** Seamless 1-on-1 and group consultation rooms powered by **Stream SDK**.
- **Event-Driven AI Intelligence:** Background job processing with **Inngest** for non-blocking meeting analysis.
- **Automated Synthesis:** Generates instant meeting summaries, action items, and transcripts using **OpenAI GPT-4o**.
- **Full-Stack SaaS Architecture:** Robust user management and subscription-ready database modeling.
- **Type-Safe Persistence:** Highly optimized PostgreSQL schema with **Drizzle ORM** for lightning-fast queries.

---

## 🏗️ System Architecture

```text
blastX: Real-Time AI Consultation Architecture
==============================================

PHASE 1: SESSION INITIATION & STREAMING
---------------------------------------
USER A (Host)      NEXT.JS (WEB)        STREAM SDK        AI (Consultor)
  |                  |                    |                  |
  |--  Create Room ->|                    |                  |
  |                  |-- 2. Auth Tokens ->|                  |
  |                  |                    |                  |
  |<-- 3. Room ID ---|                    |                  |
  |                  |                    |                  |
  |------------------ 4. LIVE VIDEO STREAM ------------------|
  |                  |                    |                  |


PHASE 2: EVENT-DRIVEN PROCESSING (ASYNC)
-----------------------------------------
STREAM SDK        INNGEST (WORKER)      OPENAI API        NEON DB (POSTGRES)
  |                  |                    |                  |
  |-- 1. Webhook ---->|                   |                  |
  |   (Meeting End)  |-- 2. Fetch Audio ->|                  |
  |                  |                    |                  |
  |                  |-- 3. Transcription / Analysis ------->|
  |                  |                    |                  |
  |                  |<-- 4. JSON Summary-|                  |
  |                  |                    |                  |
  |                  |-- 5. Save Analysis ------------------>|
  |                  |                                       |


PHASE 3: CONSULTATION & INSIGHTS
---------------------------------
USER               NEXT.JS (WEB)        NEON DB (POSTGRES)   AI AGENT
  |                  |                    |                  |
  |-- 1. View Note ->|                    |                  |
  |                  |-- 2. Query Data -->|                  |
  |                  |                    |<-- 3. Context ---|
  |                  |                    |                  |
  |-- 4. Ask AI ---->|-- 5. Contextual Prompt -------------->|
  |                  |                                       |
  |<-- 6. AI Insight |<-- 7. Response (Streaming) -----------|

```

# Tech Stack 
Front End: Next.js , TypeScript , Tailwind CSS
Backend: Node.js, Inngest 
AI : OpenAI API(GPT-4o), Whisper(Transcription)
Streaming: Stream SDK
Database: Neon DB, Drizzle ORM
Authentication : Clerk/NextAuth

## Quick Start

1. Clone repo
 ```bash
git clone [https://github.com/aleung910/blastX.git](https://github.com/aleung910/blastX.git)
cd blastX
```

2. Install dependencies
 ```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_STREAM_API_KEY="your_stream_key"
STREAM_SECRET_KEY="your_stream_secret"
OPENAI_API_KEY="your_openai_key"
DATABASE_URL="postgresql://user:pass@neon-host:5432/blastx"
INNGEST_EVENT_KEY="your_inngest_key"
```
4. Run development server
 ```bash
npm run dev
```
