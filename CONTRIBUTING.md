# Contributing to vue-draggable-next

We love your input! We want to make contributing to vue-draggable-next as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## 🏗️ Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/vue-draggable-next.git
cd vue-draggable-next

# Install dependencies
npm install

# Start development server
npm run playground:dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🧪 Testing

We use Jest for testing. Please add tests for any new features or bug fixes.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run test:types
```

### Writing Tests

```typescript
// __tests__/my-feature.spec.ts
import { mount } from '@vue/test-utils'
import { VueDraggableNext } from '../src'

describe('MyFeature', () => {
  it('should work correctly', () => {
    const wrapper = mount(VueDraggableNext, {
      props: {
        list: [{ id: 1, name: 'Item 1' }]
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })
})
```

## 📝 Code Style

We use Prettier and ESLint to maintain code quality:

```bash
# Check formatting
npm run lint

# Fix formatting issues
npm run lint:fix
```

### Style Guidelines

- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Add JSDoc comments for public APIs
- Use semantic commit messages

## 🐛 Bug Reports

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Vue version [e.g. 3.3.0]
 - Package version [e.g. 2.2.1]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

We track feature requests as GitHub issues. Provide as much detail as possible:

- **Is your feature request related to a problem?** Describe the problem.
- **Describe the solution you'd like** - A clear description of what you want to happen.
- **Describe alternatives you've considered** - Other solutions you've considered.
- **Additional context** - Screenshots, examples, etc.

## 📋 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(core): add support for custom clone function
fix(types): correct TypeScript definitions for events
docs(readme): update installation instructions
test(drag): add tests for drag and drop functionality
```

## 🔄 Release Process

1. All changes go through pull requests
2. Releases are automated via GitHub Actions
3. Version bumps follow [Semantic Versioning](https://semver.org/)
4. Changelog is automatically generated

## 📚 Documentation

- Update README.md for API changes
- Add JSDoc comments for new public methods
- Include examples in the playground
- Update TypeScript definitions

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🏷️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 📞 Contact

- Create an issue for bugs and feature requests
- Start a discussion for questions and ideas
- Join our Discord server (coming soon!)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉