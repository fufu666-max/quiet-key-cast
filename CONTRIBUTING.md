# Contributing to Quiet Key Cast

Thank you for your interest in contributing to Quiet Key Cast! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 20+
- npm 7.0.0+
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TabNelson/quiet-key-cast.git
cd quiet-key-cast
```

2. Install dependencies:
```bash
npm install
cd ui && npm install && cd ..
```

3. Set up environment variables:
```bash
# For Sepolia deployment
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
```

### Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and ensure tests pass:
```bash
npm run test
cd ui && npm run test && cd ..
```

3. Format and lint your code:
```bash
npm run lint
npm run prettier:write
```

4. Commit your changes with conventional commits:
```bash
git commit -m "feat: add new feature"
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style and conventions
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## Testing

### Backend Tests

```bash
# Run all tests
npm run test

# Run Sepolia integration tests
npm run test:sepolia
```

### Frontend Tests

```bash
cd ui
npm run test
```

## Deployment

### Local Development

1. Start local FHEVM node:
```bash
npx hardhat node
```

2. Deploy contract:
```bash
npx hardhat deploy --network localhost
```

3. Start frontend:
```bash
cd ui && npm run dev
```

### Sepolia Deployment

1. Deploy to Sepolia:
```bash
npx hardhat deploy --network sepolia
```

2. Update contract address in `ui/src/config/contracts.ts`

## Security Considerations

- This project handles encrypted data and voting
- Follow FHE best practices
- Never commit private keys or sensitive data
- Report security issues privately to maintainers

## License

By contributing to this project, you agree that your contributions will be licensed under the BSD-3-Clause-Clear license.
