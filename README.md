# 🤖 AI Email Agent

<div align="center">

![AI Email Agent](https://img.shields.io/badge/AI%20Email%20Agent-Production%20Ready-brightgreen?style=for-the-badge&logo=artificial-intelligence)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-LLaMA%203.1-orange?style=flat-square&logo=meta&logoColor=white)](https://groq.com/)

[![Deployment](https://img.shields.io/badge/Deploy%20with-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=opensource&logoColor=white)](#license)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-ff69b4?style=flat-square&logo=github&logoColor=white)](#contributing)

**Professional AI-powered email generator for job applications**  
*Create personalized, concise emails in seconds with custom templates and bulk processing*

[🚀 Live Demo](https://koushal.tech) • [📖 Documentation](#documentation) • [🔧 Setup Guide](#installation) • [🤝 Contributing](#contributing)

</div>

---

## ✨ Features

<div align="center">

| 🎯 **Smart Email Generation** | 📊 **Bulk Processing** | 🎨 **User-Friendly Setup** |
|:---:|:---:|:---:|
| AI-powered personalized emails | Excel/CSV upload support | Intuitive email configuration |
| 40-50 word ultra-concise format | Batch email generation | One-click Gmail setup guide |
| Custom template support | Progress tracking | Color-coded status indicators |

</div>

### 🔥 Core Capabilities

- **🤖 AI-Powered Generation**: Leverages Groq's LLaMA 3.1 model for intelligent email composition
- **📧 User-Managed Email**: Each user configures their own email credentials securely through the UI
- **📊 Excel Integration**: Upload Excel files with job data for bulk email generation
- **🎨 Modern UI**: Beautiful gradient design with smooth animations and transitions
- **📱 Mobile Responsive**: Optimized for all device sizes and screen resolutions
- **🔒 Secure**: User-managed credentials with environment-based API key management
- **⚡ Fast**: Optimized Next.js 14 with server-side rendering and edge functions
- **🌐 Public Ready**: Multi-user platform where anyone can use their own email account

---

## 🏗️ Architecture

```mermaid
graph TB
    A[User Interface] --> B[Next.js App Router]
    B --> C[API Routes]
    C --> D[Groq AI Service]
    C --> E[Email Service]
    C --> F[Excel Parser]
    
    G[Environment Variables] --> C
    H[Vercel Deployment] --> B
    I[Custom Domain] --> H
    
    subgraph "Core Services"
        D
        E
        F
    end
    
    subgraph "Infrastructure"
        G
        H
        I
    end
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17+ 
- **npm** or **pnpm**
- **Groq API Key** ([Get one here](https://console.groq.com/keys))
- **Gmail Account** (for email sending)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KoushalShrma/aiEmailAgent.git
   cd aiEmailAgent
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   NEXTJS_URL=http://localhost:3000
   ```
   
   **Note:** Email credentials are configured by each user through the application interface.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser & configure email**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Go to "Email Generator" tab
   - Click "Email Settings" to configure your email credentials

---

## 🔧 API Configuration

### Getting Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Create an account or sign in
3. Generate a new API key
4. Add it to your Vercel environment variables (for deployment) or local environment (for development)

### User Email Configuration

**For End Users:** No setup required! Users configure their own email settings directly in the application:

1. Open the application
2. Go to the "Email Generator" tab
3. Click "Email Settings" in the blue configuration card
4. Enter your email and app password
5. Test and save the configuration

**For Gmail Users:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this 16-character password (not your regular Gmail password)

### 🎯 User Workflow

1. **First Visit**: See a blue setup card prompting email configuration
2. **Email Setup**: Click "Email Settings" → Enter credentials → Test connection
3. **Profile Setup**: Fill in your name, contact details, and job preferences
4. **Generate Emails**: Upload Excel file or manually add job applications
5. **Send Emails**: Review generated emails and send directly from the platform

---

## 📁 Project Structure

```
ai-email-agent/
├── app/                        # Next.js App Router
│   ├── api/                   # API Routes
│   │   ├── generate-email/    # AI email generation
│   │   ├── send-email/        # Email delivery service
│   │   ├── update-api-key/    # API key management
│   │   └── validate-*/        # Validation endpoints
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── loading.tsx           # Loading component
│   └── page.tsx              # Main dashboard
├── components/               # React components
│   ├── ui/                   # Shadcn/ui components
│   ├── analytics-dashboard.tsx
│   ├── api-key-settings.tsx
│   ├── application-tracker.tsx
│   └── email-config-dialog.tsx
├── lib/                      # Utility libraries
│   ├── email-service.ts      # Email handling
│   ├── excel-parser.ts       # Excel processing
│   └── utils.ts              # Helper functions
├── public/                   # Static assets
└── styles/                   # Additional styles
```

---

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKoushalShrma%2FaiEmailAgent)

1. **Connect to Vercel**
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

2. **Configure Environment Variables**
   ```
   GROQ_API_KEY=your_groq_api_key
   NEXTJS_URL=https://your-domain.vercel.app
   ```

   **🔒 Security Note:** Email credentials are configured by each user through the application interface, ensuring:
   - **Privacy**: No shared email accounts
   - **Security**: Credentials never stored in environment variables
   - **Flexibility**: Users can use any email provider (Gmail, Outlook, custom SMTP)
   - **Scalability**: Unlimited users without credential conflicts

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Custom Domain Setup

1. Add your domain in Vercel project settings
2. Configure DNS records:
   ```
   Type: CNAME
   Name: @ (or subdomain)
   Value: cname.vercel-dns.com
   ```

---

## 📊 Performance

<div align="center">

| Metric | Score | Status |
|:---:|:---:|:---:|
| **Lighthouse Performance** | 95+ | ✅ Excellent |
| **First Contentful Paint** | < 1.5s | ✅ Fast |
| **Largest Contentful Paint** | < 2.5s | ✅ Good |
| **Cumulative Layout Shift** | < 0.1 | ✅ Stable |
| **Time to Interactive** | < 3.0s | ✅ Responsive |

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend & AI
![Groq](https://img.shields.io/badge/Groq-FF6B35?style=for-the-badge&logo=meta&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

### Tools & Libraries
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-F56565?style=for-the-badge&logo=lucide&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

</div>

---

## 📈 Usage Examples

### Email Configuration (User Setup)

```typescript
// Users configure their email settings through the UI
const emailConfig = {
  service: "gmail",
  user: "user@gmail.com", 
  password: "app_specific_password"
};

// Validate email configuration
const response = await fetch('/api/validate-email-config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailConfig)
});
```

### AI Email Generation

```typescript
// Generate a personalized job application email
const response = await fetch('/api/generate-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userProfile: {
      name: "John Doe",
      contactFields: [
        { label: "Email", value: "john@example.com" },
        { label: "Phone", value: "+1234567890" }
      ],
      emailPurpose: {
        position: "Software Engineer",
        reason: "Excited about the role and company mission"
      }
    }
  })
});
```

### Send Email with User Credentials

```typescript
// Send email using user's configured credentials
const response = await fetch('/api/send-email', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: "hr@company.com",
    subject: "Application for Software Engineer Position",
    body: generatedEmailContent,
    senderConfig: userEmailConfig // User's email configuration
  })
});
```

### Bulk Processing with Excel

```typescript
// Upload and process Excel file
const formData = new FormData();
formData.append('file', excelFile);
formData.append('userProfile', JSON.stringify(profile));

const response = await fetch('/api/generate-email', {
  method: 'POST',
  body: formData
});
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional Commits** for commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Koushal Sharma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **[Groq](https://groq.com/)** - For providing fast AI inference
- **[Vercel](https://vercel.com/)** - For seamless deployment platform
- **[Shadcn/ui](https://ui.shadcn.com/)** - For beautiful UI components
- **[Next.js](https://nextjs.org/)** - For the amazing React framework

---

<div align="center">

**Built with ❤️ by [Koushal Sharma](https://github.com/KoushalShrma)**

[![GitHub Profile](https://img.shields.io/badge/Follow-KoushalShrma-black?style=for-the-badge&logo=github)](https://github.com/KoushalShrma)
[![Website](https://img.shields.io/badge/Website-koushal.tech-blue?style=for-the-badge&logo=safari)](https://koushal.tech)

*If you found this project helpful, please give it a ⭐ on GitHub!*

</div>

---

## 🔗 Links

- **🚀 Live Demo**: [https://koushal.tech](https://koushal.tech)
- **📚 Repository**: [https://github.com/KoushalShrma/aiEmailAgent](https://github.com/KoushalShrma/aiEmailAgent)
- **🐛 Issues**: [Report a bug or request a feature](https://github.com/KoushalShrma/aiEmailAgent/issues)
- **💬 Discussions**: [Join the community discussion](https://github.com/KoushalShrma/aiEmailAgent/discussions)
- **📖 Documentation**: Complete setup guide and API reference included above

---

<div align="center">
<sub>⚡ Powered by Next.js, Groq AI, and modern web technologies</sub>
</div>
