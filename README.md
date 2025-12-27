# 개발
## 개발 환경
1. MacBook에서 Antigravity로 개발
2. 개발은 Phase 1: Foundation까지 완료함.
3. 이 코드는 바이브 코딩으로 만들었고, 중간에 직접 수정한 부분은 하나도 없음
4. Agent는 Gemini 3 Pro로 개발
5. 작업 스크립트는 OpenAI의 ChatGPT로 작성함 - Solar Pro 2로 작성해도 비슷하나 테스트용 토큰이 부족함
6. Vercel로 배포함

## 참조 링크(Upstage)
https://console.upstage.ai/api/chat
https://console.upstage.ai/docs/capabilities/digitize/document-parsing
https://console.upstage.ai/api/document-digitization/document-parsing
https://console.upstage.ai/docs/getting-started

## Original README

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# AI Marketing Automation Service (Generative AI Chatbot)

This project is a Next.js-based web application designed to automate marketing tasks using Generative AI (Upstage Solar LLM). It mimics the interface of ChatGPT and provides a seamless chat experience for marketers and content creators.

## 🚀 Features

- **Chat Interface**: Fully responsive, ChatGPT-like UI using Shadcn/UI and Tailwind CSS.
- **AI Integration**: Powered by Upstage Solar API with real-time streaming responses.
- **Chat History**: Manages multiple chat sessions with persistent history (Local State).
- **Markdown Support**: Renders rich text (code blocks, lists, headers) in AI responses.
- **Clean Architecture**: Built with Next.js App Router, Zustand for state management, and clear component separation.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: Zustand
- **AI Model**: Upstage Solar (via API)
- **Icons**: Lucide React

## 🏁 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Upstage API Key:
   ```env
   UPSTAGE_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📅 Development Roadmap (Service Upgrade Plan)

To evolve this prototype into a full-fledged Marketing Automation SaaS, we propose the following development phases:

### Phase 1: Foundation (Current Status) ✅
- [x] Basic Chat UI implementation (Sidebar, Input, Message Bubbles).
- [x] Upstage Solar API integration with SSE Streaming.
- [x] Local State Management (Zustand) for Chat History.
- [x] Markdown rendering.

### Phase 2: Data Persistence & Authentication 🚧
- [ ] **Database Integration**: Migrate from local memory to a database (PostgreSQL / Supabase) to permanently store chat history.
- [ ] **User Authentication**: Implement Login/Signup (NextAuth.js or Clerk) to personalize workspaces.
- [ ] **Cloud Sync**: Sync chat history across devices.

### Phase 3: Advanced RAG (Document Analysis)
- [ ] **File Upload**: Allow users to drag & drop PDF/PPT/Images.
- [ ] **Upstage Document Parse API**: Integrate Upstage's specific API to digitize documents.
- [ ] **Context-Aware Chat**: Enable the AI to answer questions based on uploaded marketing reports or guidelines.

### Phase 4: Marketing Specialized Features
- [ ] **Prompt Library**: Built-in templates for "Email Marketing", "Blog Post", "Ad Copy", "SEO Keywords".
- [ ] **Tone & Brand Voice Settings**: Allow users to define their brand voice (e.g., Professional, Witty) and force the AI to adhere to it.
- [ ] **Multi-Model Support**: Toggle between `solar-pro`, `gpt-4o`, etc., depending on the complexity of the task.

### Phase 5: Export & Integrations
- [ ] **One-Click Export**: Save generated content as Markdown, PDF, or HTML.
- [ ] **CMS Integration**: Directly publish blog posts to WordPress or CMS platforms.
- [ ] **Social Media Connect**: Schedule or draft posts for LinkedIn/Twitter directly from the chat.

### Phase 6: Enterprise & Deployment
- [ ] **Team Collaboration**: Shared workspaces for marketing teams.
- [ ] **Analytics Dashboard**: Track token usage and content generation metrics.
- [ ] **Production Deployment**: Optimize for edge caching and global CDN (Vercel).

## 📂 Project Structure

```
/src
 ├── app/               # Next.js App Router Pages & API Routes
 │    ├── api/chat/     # Chat Generation Endpoint
 │    ├── globals.css   # Global Styles
 │    └── page.tsx      # Main Entry Point
 ├── components/        # React Components
 │    ├── chat/         # Chat Interface (Bubble, Input, Area)
 │    ├── layout/       # Sidebar, Layout wrappers
 │    └── ui/           # Shadcn Reusable UI Components
 ├── lib/               # Utilities (clsx, fetchers)
 ├── store/             # Zustand State Store (chat-store.ts)
 └── types/             # TypeScript Interfaces (Message, ChatSession)
```

---

