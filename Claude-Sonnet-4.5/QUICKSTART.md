# Quick Start Guide - Responsive Onboarding UI v2

This is a 5-minute guide to get the project running and see the fixes in action.

## ⚡ Prerequisites Check

```powershell
# Check if Node.js is installed
node -v
# Should show: v18.x.x or later

# Check if npm is installed
npm -v
# Should show: 9.x.x or later
```

If not installed: [Download Node.js](https://nodejs.org/)

---

## 🚀 3-Step Setup

### Step 1: Install Dependencies (2 min)

```powershell
# In project directory (c:\chatWorkSpace)
npm install
```

### Step 2: Install Browser for Testing (1 min)

```powershell
npx playwright install chromium
```

### Step 3: Run Development Server (instant)

```powershell
npm run dev
```

✅ **Browser should open automatically to http://localhost:3000**

---

## 🎮 Try the Fixes

### 1. Test Responsive Layout (13" Laptop)

1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select "Responsive" and set to **1280 x 800**
4. Navigate through wizard steps
5. ✅ **Verify**: No overlap between header and content

### 2. Test Mobile Safari CTA

1. In DevTools, select "iPhone 12" (390 x 844)
2. Navigate to final step (Complete Onboarding)
3. Scroll down
4. ✅ **Verify**: Submit button is always visible (not covered by footer)

### 3. Test Dark Mode Markdown

1. Click theme toggle (moon icon) in top-right
2. Navigate to Step 3 (Handbook Review)
3. ✅ **Verify**: Markdown content styled properly (no raw HTML tags like `<div>`)
4. Check highlight boxes are styled with dark theme colors

### 4. Test Keyboard Navigation

1. Refresh page
2. Press **Tab** key repeatedly
3. ✅ **Verify**: 
   - Skip link appears first
   - Focus indicators clearly visible
   - Can navigate entire wizard with keyboard
   - Press **Enter** on Next button to advance steps

---

## 🧪 Run Tests (1 min)

```powershell
npm test
```

Expected output:
```
✓ Desktop Layout - No Overlap
✓ 13-inch Laptop Breakpoint  
✓ Mobile Safari - Visible CTA
✓ Dark Mode Markdown Rendering
✓ Keyboard Navigation

📸 Screenshots: docs/screenshots/
```

View screenshots:
```powershell
ii docs\screenshots\
```

---

## 📸 See the Results

After running tests, check these screenshots:

1. **desktop-layout.png** - Full desktop view
2. **laptop-13-layout.png** - 13" laptop (critical fix)
3. **mobile-safari-cta-visible.png** - Mobile CTA visible
4. **mobile-safari-submit-visible.png** - Submit button accessible
5. **dark-mode-markdown.png** - Dark theme rendering
6. **keyboard-navigation.png** - Focus indicators

---

## 🔍 Compare Before/After

### Before (Broken)
❌ 13" laptop: Header overlaps form  
❌ Mobile: Submit button hidden under footer  
❌ Dark mode: Shows `<div class="highlight-box">` as text  
❌ Keyboard: Can't navigate some elements  

### After (Fixed) ✅
✅ 13" laptop: Proper spacing, no overlap  
✅ Mobile: CTAs always visible with safe-area padding  
✅ Dark mode: HTML renders with theme styling  
✅ Keyboard: Full navigation with focus indicators  

---

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Setup Details**: See `SETUP.md`
- **Root Cause Analysis**: See `docs/root-cause-analysis.md`
- **Test Scenarios**: See `docs/test-scenarios.md`
- **Deliverables**: See `DELIVERABLES.md`
- **Summary**: See `SUMMARY.md`

---

## 🆘 Troubleshooting

### Issue: Port 3000 already in use

```powershell
# Kill process using port 3000
netstat -ano | findstr :3000
# Note the PID, then:
taskkill /PID <PID> /F
```

### Issue: Tests fail

```powershell
# Reinstall dependencies
rm -r node_modules
npm install

# Reinstall Playwright browsers
npx playwright install --with-deps chromium
```

### Issue: Can't see dark mode

- Click moon icon (🌙) in header top-right
- Or: Your system might be in dark mode already

---

## ✅ Success Checklist

After following this guide, you should have:

- ✅ Development server running at http://localhost:3000
- ✅ All 5 UI tests passing
- ✅ 6 screenshots generated in `docs/screenshots/`
- ✅ Verified fixes in browser DevTools
- ✅ Seen dark mode Markdown rendering
- ✅ Tested keyboard navigation

---

## 🎉 Next Steps

1. **Review the code**: Explore `frontend/components/`
2. **Read the docs**: Check `docs/root-cause-analysis.md`
3. **Run tests again**: `npm test` (should take ~14 seconds)
4. **Build for production**: `npm run build`
5. **Deploy**: Ready for staging/production

---

**Time to complete**: ~5 minutes  
**Lines of code**: ~2,500  
**Components**: 8 React components  
**Tests**: 5 comprehensive scenarios  

Enjoy the fixed UI! 🚀
