# 🔒 Git Security Guide for WealthSage

## ⚠️ CRITICAL: Files That Should NEVER Be Committed

### 🔑 **API Keys and Secrets (MOST IMPORTANT)**
```
.env                    # Contains TAVILY_API_KEY and other secrets
.env.local             # Local environment variables
.env.production        # Production secrets
*.key                  # Any key files
secrets/               # Any secrets directory
config/secrets.json    # Secret configuration files
```

### 📁 **Large/Generated Files**
```
node_modules/          # Frontend dependencies (can be reinstalled)
__pycache__/          # Python compiled files
dist/                 # Built frontend files
build/                # Build outputs
cache/                # API response cache (optional)
*.log                 # Log files
```

### 💻 **Development Environment Files**
```
.vscode/              # VS Code settings (personal preferences)
.idea/                # PyCharm/IntelliJ settings
*.tmp                 # Temporary files
*.backup              # Backup files
```

---

## ✅ Files That SHOULD Be Committed

### 📋 **Source Code**
```
backend/              # All Python backend code
frontend/src/         # All React frontend code
ml_agents/            # AI agent code
```

### ⚙️ **Configuration Files**
```
package.json          # Frontend dependencies list
requirements.txt      # Python dependencies list
tailwind.config.js    # Tailwind CSS configuration
vite.config.js        # Vite configuration
postcss.config.js     # PostCSS configuration
```

### 📖 **Documentation**
```
README.md             # Project documentation
SETUP_GUIDE.md        # Setup instructions
*.md                  # All markdown documentation
```

### 🔧 **Project Structure**
```
.gitignore            # Git ignore rules
frontend/.gitignore   # Frontend-specific ignore rules
```

---

## 🚨 **Security Checklist Before Committing**

### 1. **Check for API Keys**
```bash
# Search for potential API keys in your code
grep -r "TAVILY_API_KEY" .
grep -r "api_key" .
grep -r "secret" .
grep -r "password" .
```

### 2. **Verify .env is Ignored**
```bash
# Make sure .env is in .gitignore
cat .gitignore | grep ".env"
```

### 3. **Check Git Status**
```bash
# Review what files will be committed
git status
git diff --cached
```

### 4. **Remove Sensitive Files if Accidentally Added**
```bash
# If you accidentally added .env file
git rm --cached .env
git commit -m "Remove .env file from tracking"

# If .env was already committed, remove from history
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env' \
--prune-empty --tag-name-filter cat -- --all
```

---

## 🔐 **Environment Variables Setup**

### **For Development:**
1. Create `.env` file in root directory
2. Add your API keys:
   ```
   TAVILY_API_KEY=your_actual_api_key_here
   ```
3. **NEVER commit this file!**

### **For Production:**
1. Set environment variables on your server
2. Use your hosting platform's environment variable settings
3. **NEVER put production keys in code**

### **For Team Members:**
1. Create `.env.example` file with placeholder values:
   ```
   TAVILY_API_KEY=your_tavily_api_key_here
   ```
2. Commit the `.env.example` file
3. Team members copy it to `.env` and add real values

---

## 📝 **Safe Commit Commands**

### **Before Every Commit:**
```bash
# 1. Check what files are being added
git status

# 2. Review changes
git diff

# 3. Add files selectively (safer than git add .)
git add backend/
git add frontend/src/
git add *.md

# 4. Commit with descriptive message
git commit -m "Add pagination and load more functionality"

# 5. Push to repository
git push origin main
```

### **Safe Add Commands:**
```bash
# Add specific directories
git add backend/
git add frontend/src/
git add frontend/package.json

# Add specific files
git add README.md
git add requirements.txt
git add tailwind.config.js

# AVOID: git add . (adds everything, including secrets)
```

---

## 🛡️ **Additional Security Tips**

### 1. **Use Environment Variables**
```python
# ✅ Good - Use environment variables
import os
api_key = os.getenv('TAVILY_API_KEY')

# ❌ Bad - Hardcoded API key
api_key = "tvly-abc123def456"
```

### 2. **Use .env.example for Documentation**
```bash
# Create example file for team
cp .env .env.example
# Edit .env.example to remove real values
# Commit .env.example, never commit .env
```

### 3. **Regular Security Checks**
```bash
# Check for accidentally committed secrets
git log --all --full-history -- .env
git log --all --full-history -- "*secret*"
```

### 4. **Use Git Hooks (Advanced)**
Create `.git/hooks/pre-commit` to automatically check for secrets before commits.

---

## 🚨 **If You Accidentally Commit Secrets**

### **Immediate Actions:**
1. **Change the API key immediately**
2. **Remove from Git history**
3. **Force push the cleaned history**
4. **Notify team members to pull latest changes**

### **Commands to Remove Secrets:**
```bash
# Remove file from latest commit
git rm --cached .env
git commit --amend -m "Remove .env file"

# Remove from entire Git history (DANGEROUS - use carefully)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env' \
--prune-empty --tag-name-filter cat -- --all

# Force push (only if repository is private and you're sure)
git push origin --force --all
```

---

## ✅ **Current .gitignore Status**

The project now has comprehensive .gitignore files that protect:
- ✅ API keys and environment variables
- ✅ Node modules and Python cache
- ✅ Build outputs and temporary files
- ✅ Editor-specific files
- ✅ OS-generated files

**Your secrets are now protected from accidental commits!** 🔒
