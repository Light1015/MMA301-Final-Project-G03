import AuthModel from '../models/AuthModel';

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const AuthController = {
  login: async (email, password) => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    else if (!isValidEmail(email)) errors.email = 'Email is invalid';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors };
    }

    try {
      const user = await AuthModel.login(email, password);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, message: err?.message || 'Login failed' };
    }
  },

  register: async (userData) => {
    const errors = {};
    
    // Validate name
    if (!userData.name || !userData.name.trim()) {
      errors.name = 'Name is required';
    } else if (userData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!userData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(userData.email)) {
      errors.email = 'Email is invalid';
    }

    // Validate password
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[0-9])/.test(userData.password)) {
      errors.password = 'Password must contain letters and numbers';
    }

    // Role không cần validate vì luôn là 'Learner' khi đăng ký
    // Chỉ Admin mới có thể tạo Teacher/Admin qua User Management

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors };
    }

    try {
      const user = await AuthModel.register(userData);
      return { ok: true, user };
    } catch (err) {
      // Handle email already exists error
      if (err?.field === 'email') {
        return { ok: false, errors: { email: err.message } };
      }
      return { ok: false, message: err?.message || 'Registration failed' };
    }
  },
};

export default AuthController;
