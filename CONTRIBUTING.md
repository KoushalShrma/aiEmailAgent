# Contributing to AI Email Agent

Thank you for your interest in contributing to AI Email Agent! We welcome contributions from the community and are grateful for your support.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots or screen recordings if applicable**
- **Include your environment details** (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **Include mockups or examples if applicable**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if applicable
4. **Ensure the test suite passes**
5. **Update documentation** as needed
6. **Create a pull request** with a clear title and description

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.17 or higher
- npm or pnpm
- Git

### Getting Started

1. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/aiEmailAgent.git
   cd aiEmailAgent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Make your changes**

6. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

## 📋 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop typing with TypeScript
- Implement error boundaries where appropriate

### File Organization

- Place components in the `components/` directory
- Use the `lib/` directory for utilities and services
- API routes go in `app/api/`
- Follow the existing naming conventions

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design for all screen sizes
- Use CSS variables for theme consistency

## 🧪 Testing

- Write tests for new functionality
- Ensure existing tests pass
- Test on multiple browsers and devices
- Verify accessibility compliance

## 📝 Commit Messages

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(email): add template customization
fix(api): resolve Groq API timeout issue
docs(readme): update installation instructions
```

## 🔒 Security

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Follow security best practices
- Report security vulnerabilities privately

## 📄 License

By contributing to AI Email Agent, you agree that your contributions will be licensed under the MIT License.

## 🎯 Areas for Contribution

We're particularly interested in contributions in these areas:

### Frontend
- UI/UX improvements
- Accessibility enhancements
- Mobile responsiveness
- Performance optimizations

### Backend
- API performance improvements
- Error handling enhancements
- Security improvements
- Database integration

### Features
- Additional email templates
- Export/import functionality
- Analytics and reporting
- Integration with other services

### Documentation
- API documentation
- User guides
- Video tutorials
- Code examples

## 💬 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and community discussion
- **Documentation**: Check the README and code comments

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes for significant contributions
- Our hall of fame (coming soon!)

Thank you for helping make AI Email Agent better! 🚀