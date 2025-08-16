// Admin Configuration
export const adminConfig = {
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  sessionKey: 'swayAdminSession',
};

// Session management utilities
export const sessionUtils = {
  // Create a session hash (simple hash for localStorage)
  createSessionHash: (password) => {
    return btoa(password + Date.now()).slice(0, 20);
  },

  // Store session in localStorage
  storeSession: (password) => {
    const session = {
      timestamp: Date.now(),
      expiresAt: Date.now() + adminConfig.sessionTimeout,
      sessionHash: sessionUtils.createSessionHash(password),
    };
    localStorage.setItem(adminConfig.sessionKey, JSON.stringify(session));
  },

  // Check if session is valid
  isSessionValid: () => {
    try {
      const sessionData = localStorage.getItem(adminConfig.sessionKey);
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      const now = Date.now();

      // Check if session has expired
      if (now > session.expiresAt) {
        sessionUtils.clearSession();
        return false;
      }

      return true;
    } catch {
      sessionUtils.clearSession();
      return false;
    }
  },

  // Clear session
  clearSession: () => {
    localStorage.removeItem(adminConfig.sessionKey);
  },

  // Get session data
  getSession: () => {
    try {
      const sessionData = localStorage.getItem(adminConfig.sessionKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  },
};
