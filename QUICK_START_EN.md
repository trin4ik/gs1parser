# 🚀 Quick Start Guide

## Testing GS1 Parser Functionality

### 1. Run Tests
```bash
./scripts/docker-test.sh
```
or
```bash
npm run docker:test
```

### 2. Run Examples
```bash
./scripts/docker-example.sh
```
or
```bash
npm run docker:example
```

### 3. Build Project
```bash
./scripts/docker-build.sh
```
or
```bash
npm run docker:build
```

### 4. Development Mode
```bash
./scripts/docker-dev.sh
```
or
```bash
npm run docker:dev
```

## What's Being Tested

### ✅ Tests (20 tests)
- Parsing fixed AIs (01, 17, etc.)
- Parsing variable AIs (10, 21, 91-99)
- Handling scanner artifacts (029, spaces)
- Restoring {GS} separators
- Error handling
- Parser configuration

### ✅ Usage Examples
- Basic GS1 string parsing
- Working with variable AIs
- AI 91-99 with separators
- Cleaning scanner artifacts
- Custom configuration
- Convenient parseGS1 function
- Error handling

## Expected Results

When successfully run, you should see:
- ✅ All 20 tests passed
- ✅ 7 parser usage examples
- ✅ Cleaned strings with {GS} separators
- ✅ Token arrays with AIs and values

## Possible Issues

1. **Docker not installed** - install Docker Desktop
2. **No Docker permissions** - add user to docker group
3. **Port busy** - stop other containers

## Next Steps

After successful testing:
1. Package is ready for use
2. Can be published to NPM
3. Can be integrated into other projects

