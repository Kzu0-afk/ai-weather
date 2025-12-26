# IntelliJ Ultimate Run/Debug Configurations

This guide helps you set up run/debug configurations for both the frontend and backend in IntelliJ Ultimate.

---

## Quick Commands Reference

**Backend (NestJS):**
```bash
cd ai-weather-backend
npm run start:dev    # Development with watch mode (port 3001)
npm run start:debug  # Debug mode with watch
```

**Frontend (Next.js):**
```bash
cd ai-weather-frontend
npm run dev          # Development server (port 3000)
```

---

## Setting Up Run Configurations in IntelliJ

### Backend Configuration (NestJS)

1. **Open Run/Debug Configurations**
   - Click the dropdown next to the run button (top right)
   - Select "Edit Configurations..." or press `Alt+Shift+F10` → `E`

2. **Add New Configuration**
   - Click the `+` button (top left)
   - Select **"npm"**

3. **Configure Backend:**
   - **Name:** `Backend - NestJS (Dev)`
   - **Package.json:** `ai-weather-backend/package.json`
   - **Command:** `run`
   - **Scripts:** `start:dev`
   - **Working directory:** `$PROJECT_DIR$/ai-weather-backend`
   - **Environment variables:** (Optional - add if you have `.env` file)
     ```
     PORT=3001
     FRONTEND_ORIGIN=http://localhost:3000
     ```

4. **For Debug Mode:**
   - Duplicate the configuration above
   - **Name:** `Backend - NestJS (Debug)`
   - **Scripts:** `start:debug`
   - **Before launch:** Add "Build" task (optional)

---

### Frontend Configuration (Next.js)

1. **Add New Configuration**
   - Click the `+` button
   - Select **"npm"**

2. **Configure Frontend:**
   - **Name:** `Frontend - Next.js (Dev)`
   - **Package.json:** `ai-weather-frontend/package.json`
   - **Command:** `run`
   - **Scripts:** `dev`
   - **Working directory:** `$PROJECT_DIR$/ai-weather-frontend`
   - **Environment variables:** (Optional - add if you have `.env.local` file)
     ```
     NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
     ```

---

## Alternative: Using Node.js Run Configuration

If npm configurations don't work well, you can use Node.js configurations directly:

### Backend (Node.js)

1. **Add New Configuration**
   - Click `+` → Select **"Node.js"**

2. **Configure:**
   - **Name:** `Backend - NestJS`
   - **Node interpreter:** (Auto-detected)
   - **Node parameters:** `--loader ts-node/esm` (if needed)
   - **Working directory:** `$PROJECT_DIR$/ai-weather-backend`
   - **JavaScript file:** `node_modules/@nestjs/cli/bin/nest.js`
   - **Application parameters:** `start --watch`
   - **Environment variables:**
     ```
     PORT=3001
     FRONTEND_ORIGIN=http://localhost:3000
     ```

### Frontend (Node.js)

1. **Add New Configuration**
   - Click `+` → Select **"Node.js"**

2. **Configure:**
   - **Name:** `Frontend - Next.js`
   - **Node interpreter:** (Auto-detected)
   - **Working directory:** `$PROJECT_DIR$/ai-weather-frontend`
   - **JavaScript file:** `node_modules/next/dist/bin/next`
   - **Application parameters:** `dev`
   - **Environment variables:**
     ```
     NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
     ```

---

## Recommended Setup: Compound Configuration

To run both frontend and backend together:

1. **Add New Configuration**
   - Click `+` → Select **"Compound"`

2. **Configure:**
   - **Name:** `Run All (Frontend + Backend)`
   - **Add configurations:**
     - `Backend - NestJS (Dev)`
     - `Frontend - Next.js (Dev)`

3. **Run:**
   - Select "Run All (Frontend + Backend)" from the dropdown
   - Click Run (or press `Shift+F10`)

---

## Environment Files

Make sure you have the following environment files:

### Backend: `ai-weather-backend/.env`
```bash
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
```

### Frontend: `ai-weather-frontend/.env.local`
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

**Note:** IntelliJ will automatically load `.env` files if they exist in the working directory.

---

## Debugging Tips

### Backend Debugging
- Use `start:debug` script (enables Node.js inspector)
- Set breakpoints in `.ts` files
- IntelliJ will automatically attach the debugger

### Frontend Debugging
- Next.js runs in development mode by default
- Set breakpoints in React components
- Use Chrome DevTools or IntelliJ's built-in debugger

### Port Conflicts
- Backend default: `3001` (change in `.env` if needed)
- Frontend default: `3000` (Next.js will prompt if port is in use)

---

## Quick Access

After setup, you can:
- **Run:** Select configuration from dropdown → Click Run button (or `Shift+F10`)
- **Debug:** Select configuration → Click Debug button (or `Shift+F9`)
- **Stop:** Click Stop button (or `Ctrl+F2`)

---

## Troubleshooting

**Issue:** npm scripts not found
- **Solution:** Make sure `node_modules` are installed (`npm install` in each directory)

**Issue:** Port already in use
- **Solution:** Change port in environment variables or kill the process using the port

**Issue:** Environment variables not loading
- **Solution:** Add them explicitly in the run configuration's "Environment variables" field

**Issue:** TypeScript errors
- **Solution:** Make sure TypeScript is properly configured and `tsconfig.json` exists

