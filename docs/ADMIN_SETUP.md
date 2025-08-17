# Admin Panel Setup

## 🔐 Password Protection

The Sway Quest admin panel at `/argo` is protected with a simple password system.

### **Local Development Setup:**

1. **Create `.env.local` file** in your project root:
```bash
ADMIN_PASSWORD=your-secure-admin-password-here
```

2. **Start development server:**
```bash
npm run dev
```

3. **Access admin panel:**
   - Navigate to `http://localhost:3000/argo`
   - Enter the password you set in `.env.local`
   - Session will persist for 24 hours

### **Vercel Deployment Setup:**

1. **Add environment variable in Vercel:**
   - Go to your project in Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add variable:
     - **Name**: `ADMIN_PASSWORD`
     - **Value**: `your-super-secure-admin-password-2024`
     - **Environment**: Production, Preview, Development

2. **Deploy to apply changes:**
   - Changes will apply on next deployment
   - Access admin panel at `https://your-domain.vercel.app/argo`

### **Security Features:**

✅ **Environment Variables**: Password stored securely, never in code
✅ **Session Management**: 24-hour session persistence
✅ **API Protection**: All admin API routes require password header
✅ **Auto-logout**: Sessions expire automatically
✅ **HTTPS**: Vercel provides SSL by default

### **Password Requirements:**

- **Strong password**: 12+ characters
- **Mix of characters**: Letters, numbers, symbols
- **Unique**: Don't reuse from other services
- **Regular rotation**: Change periodically

### **Example Strong Password:**
```
sway-admin-2024-secure-key-xyz123
```

### **How It Works:**

1. **Login Flow:**
   - User visits `/argo`
   - Password modal appears
   - Enter password → validate against environment variable
   - If valid → store session in localStorage
   - If invalid → show error message

2. **Session Persistence:**
   - Session stored in browser localStorage
   - Valid for 24 hours
   - Auto-logout when expired
   - Manual logout button available

3. **API Protection:**
   - All admin API routes check `x-admin-password` header
   - Password validated server-side
   - 401 Unauthorized for invalid requests

### **Troubleshooting:**

**Password not working:**
- Check environment variable is set correctly
- Restart development server after changing `.env.local`
- Clear browser localStorage and try again

**Session issues:**
- Clear browser localStorage
- Check if session has expired (24 hours)
- Try logging in again

**API errors:**
- Ensure password header is included in requests
- Check environment variable is set in Vercel
- Verify password matches exactly

### **Future Enhancements:**

- Supabase Auth integration
- Multi-factor authentication
- Role-based access control
- Audit logging
- Rate limiting

### **Files Modified:**

- `src/config/adminConfig.js` - Admin configuration
- `src/components/admin/LoginModal.js` - Login interface
- `src/lib/adminAuth.js` - API authentication
- `src/app/argo/page.js` - Protected admin page
- `src/app/api/blog/generate/route.js` - Protected API route
- `src/components/admin/BlogGenerator.js` - Updated with auth
- `src/components/admin/BlogManager.js` - Updated with auth
