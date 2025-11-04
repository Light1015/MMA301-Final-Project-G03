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
};

export default AuthController;
