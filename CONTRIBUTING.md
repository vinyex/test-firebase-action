# Contributing to Real-time System Status & Maintenance Mode

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/test-firebase-action.git`
3. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
cd scripts
npm install
```

## Making Changes

### Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code formatting
- Keep functions focused and single-purpose

### Testing Your Changes

1. Test the Node.js script with different status values:
   ```bash
   node scripts/set-status.js maintenance "Test message"
   ```

2. Verify error handling:
   ```bash
   node scripts/set-status.js invalid-status  # Should fail gracefully
   node scripts/set-status.js                 # Should show usage
   ```

3. Test the workflow locally using [act](https://github.com/nektos/act):
   ```bash
   act workflow_dispatch
   ```

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in present tense (e.g., "Add", "Fix", "Update")
- Keep the first line under 50 characters
- Add details in the body if needed

Examples:
```
Add support for custom status values
Fix error handling for invalid JSON
Update README with new examples
```

## Pull Request Process

1. Update documentation if you're changing functionality
2. Ensure all tests pass
3. Update the README.md if needed
4. Submit a pull request with a clear description of your changes

### PR Description Template

```markdown
## Description
Brief description of your changes

## Changes Made
- List of changes
- Another change

## Testing
How you tested your changes

## Related Issues
Fixes #123 (if applicable)
```

## Feature Ideas

Some ideas for contributions:

- [ ] Add support for multiple environments (dev, staging, prod)
- [ ] Create a status history feature
- [ ] Add webhooks for status changes
- [ ] Create a status dashboard UI
- [ ] Add integration with Slack/Discord notifications
- [ ] Support for other databases (MongoDB, PostgreSQL, etc.)

## Questions?

Feel free to open an issue for discussion before making significant changes.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

Thank you for contributing! 🎉
