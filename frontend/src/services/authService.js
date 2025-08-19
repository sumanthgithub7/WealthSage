const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('AuthService initialized with API_URL:', API_URL);

class AuthService {
  // Test API connection
  async testConnection() {
    try {
      console.log('Testing connection to:', API_URL);
      const response = await fetch(`${API_URL}/api/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Connection test successful:', data);
      return data;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
  }

  // Sign up new user
  async signup(userData) {
    try {
      console.log('Attempting signup with data:', { ...userData, password: '[HIDDEN]' });

      // Test connection first
      await this.testConnection();

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || 'Student',
          university: userData.university || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const { user, session_token } = data;

      // Store session data
      localStorage.setItem('session_token', session_token);
      localStorage.setItem('user_data', JSON.stringify(user));

      console.log('Signup successful:', user);
      return { user, token: session_token };

    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed. Please try again.');
    }
  }

  // Sign in existing user
  async signin(email, password) {
    try {
      console.log('Attempting signin for:', email);

      // Test connection first
      await this.testConnection();

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const { user, session_token } = data;

      // Store session data
      localStorage.setItem('session_token', session_token);
      localStorage.setItem('user_data', JSON.stringify(user));

      console.log('Signin successful:', user);
      return { user, token: session_token };

    } catch (error) {
      console.error('Signin error:', error);
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  // Sign out user
  async signout() {
    try {
      // Clear local storage
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_data');
      
      console.log('Signout successful');
      return true;
      
    } catch (error) {
      console.error('Signout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_data');
      return true;
    }
  }

  // Get current user from local storage
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data');
      const token = localStorage.getItem('session_token');
      
      if (userData && token) {
        return {
          user: JSON.parse(userData),
          token
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('session_token');
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  }

  // Get user role
  getUserRole() {
    const currentUser = this.getCurrentUser();
    return currentUser?.user?.role || null;
  }

  // Reset password
  async resetPassword(email) {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
