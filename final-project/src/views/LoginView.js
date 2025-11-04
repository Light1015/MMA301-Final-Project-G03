import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthController from '../controllers/AuthController';

// Import web SCSS only on web builds
if (Platform.OS === 'web') {
  try {
    require('../../styles/login.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  const handleSubmit = async () => {
    setErrors({});
    setServerMessage(null);
    setLoading(true);
    const res = await AuthController.login(email.trim(), password);
    setLoading(false);
    if (res.ok) {
      setEmail('');
      setPassword('');
      onLogin && onLogin(res.user);
    } else {
      if (res.errors) setErrors(res.errors);
      else setServerMessage(res.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Ionicons name="school" size={40} color="#4F46E5" />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back to Eduling Go</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        {serverMessage && <Text style={styles.error}>{serverMessage}</Text>}

        {loading ? (
          <ActivityIndicator size="small" style={styles.loading} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.hint}>
          Test accounts: guest@example.com, interviewer@example.com, learner@example.com, teacher@example.com, admin@example.com (password: password123)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#667eea', // Fallback for gradient
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    color: '#666',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
    fontSize: 14,
    width: '100%',
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    marginTop: 12,
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
