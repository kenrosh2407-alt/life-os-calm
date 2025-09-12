import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state from localStorage
  initialize: () => {
    try {
      const token = localStorage.getItem('lifeos_token');
      const userStr = localStorage.getItem('lifeos_user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
        
        // Verify session with backend
        get().verifySession();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },

  // Verify session with backend
  verifySession: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8000/api/auth/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (data.success) {
        set({ user: data.user, isAuthenticated: true });
      } else {
        get().logout();
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      get().logout();
    }
  },

  // Login user
  login: (user, token) => {
    localStorage.setItem('lifeos_token', token);
    localStorage.setItem('lifeos_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  // Logout user
  logout: async () => {
    const { token } = get();
    
    // Call logout endpoint
    if (token) {
      try {
        await fetch(`${window.location.protocol}//${window.location.hostname}:8000/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    // Clear local storage and state
    localStorage.removeItem('lifeos_token');
    localStorage.removeItem('lifeos_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Update user info
  updateUser: (updates) => {
    const { user } = get();
    const updatedUser = { ...user, ...updates };
    
    localStorage.setItem('lifeos_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));

export default useAuthStore;