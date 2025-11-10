import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import LoginView from './src/views/LoginView';
import PublicHomeView from './src/views/PublicHomeView';
import HomeView from './src/views/HomeView';
import UserManagementView from './src/views/UserManagementView';
import AuthModel from './src/models/AuthModel';

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [currentView, setCurrentView] = useState('publicHome'); // 'publicHome', 'login', 'home', 'userManagement'

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await AuthModel.getCurrentUser();
      if (mounted) {
        setUser(u);
        setCurrentView(u ? 'home' : 'publicHome');
      }
      setLoadingInit(false);
    })();
    return () => (mounted = false);
  }, []);

  const handleLogout = async () => {
    await AuthModel.logout();
    setUser(null);
    setCurrentView('publicHome');
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
        currentView === 'publicHome' ? (
          <PublicHomeView onNavigateToLogin={() => setCurrentView('login')} />
        ) : (
          <LoginView
            onLogin={(u) => {
              setUser(u);
              setCurrentView('home');
            }}
            onBack={() => setCurrentView('publicHome')}
          />
        )
      ) : (
        <View style={{ flex: 1 }}>
          {currentView === 'home' && (
            <HomeView
              user={user}
              onLogout={handleLogout}
              onNavigateToUserManagement={
                user.role === 'Admin' ? () => setCurrentView('userManagement') : undefined
              }
            />
          )}
          {currentView === 'userManagement' && user.role === 'Admin' && (
            <UserManagementView
              user={user}
              onBack={() => setCurrentView('home')}
            />
          )}
          {currentView === 'userManagement' && user.role !== 'Admin' && (
            <HomeView
              user={user}
              onLogout={handleLogout}
              onNavigateToUserManagement={undefined}
            />
          )}
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
