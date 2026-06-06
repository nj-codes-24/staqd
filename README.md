<div align="center">
  <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" alt="ZID Platform Banner" width="100%" />

  # ZID: Neural Sourcing & Knowledge Hub
  
  **A premium, glassmorphic editorial platform for modern research and academic analysis.**

  [![React](https://img.shields.io/badge/React-19.0-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Gemini API](https://img.shields.io/badge/Google_Gemini-API-8E75B2.svg?style=for-the-badge&logo=google)](https://ai.google.dev/)
</div>

<br />

## 📖 Overview

ZID is a state-of-the-art Single Page Application (SPA) designed to elevate the academic and research reading experience. Featuring a highly tactile, dark-mode focused aesthetic, the platform integrates dynamic filtering, immersive editorial layouts, and AI-driven insights to help researchers organize, read, and analyze complex scientific papers.

## ✨ Key Features

- **Premium Editorial Layout:** Distraction-free, fluid-typography reading views designed specifically for dense academic papers.
- **Dynamic Knowledge Hub:** Advanced, reactive filtering (by Relevance, Publisher, Sub-topic, and Attributes) with real-time UI synchronization.
- **Interactive Study View:** Integrated side-panel chatbots and cue cards powered by the Google Gemini API for deep research assistance.
- **Global Profile Management:** Real-time synchronized user state with an embedded, precise image cropping engine for profile avatars.
- **Fluid & Tactile UI:** Built with Framer Motion (`motion/react`) for butter-smooth micro-interactions, glassmorphic overlays, and seamless component transitions.

## 🛠️ Technology Stack

- **Core:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4 (with custom utility integrations)
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
- **AI Integration:** `@google/genai` (Gemini API)

## 🚀 Quick Start

Follow these steps to run the ZID platform locally:

### Prerequisites
- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nj-codes-24/Ziddy.git
   cd Ziddy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components (Dashboard, ArticleView, ProfileView, etc.)
├── contexts/            # Global React Contexts (e.g., BookmarkContext)
├── data/                # Mock data schemas and initial state variables
├── types.ts             # Global TypeScript interfaces
└── App.tsx              # Root application router and state manager
```

## 📜 License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.
