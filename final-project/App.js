import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import LoginView from './src/views/LoginView';
import HomeView from './src/views/HomeView';
import AuthModel from './src/models/AuthModel';

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await AuthModel.getCurrentUser();
      if (mounted) setUser(u);
      setLoadingInit(false);
    })();
    return () => (mounted = false);
  }, []);

  const handleLogout = async () => {
    await AuthModel.logout();
    setUser(null);
  };

  if (loadingInit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!user ? (
        <LoginView onLogin={(u) => setUser(u)} />
      ) : (
        <View style={{ flex: 1 }}>
          <HomeView user={user} onLogout={handleLogout} />
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#4F46E5',
  },
  sub: {
    marginBottom: 16,
    color: '#6B7280',
  },
});
