import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginView from "./src/views/LoginView";
import PublicHomeView from "./src/views/PublicHomeView";
import HomeView from "./src/views/HomeView";
import UserManagementView from "./src/views/UserManagementView";
import CourseManagementView from "./src/views/CourseManagementView";
import CourseCatalogView from "./src/views/CourseCatalogView";
import AuthModel from "./src/models/AuthModel";
import CertificateListView from "./src/views/certificates/CertificateListView";
import CertificateFormView from "./src/views/certificates/CertificateFormView";
import CertificateDetailView from "./src/views/certificates/CertificateDetailView";

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [currentView, setCurrentView] = useState("publicHome"); // 'publicHome', 'login', 'home', 'userManagement', 'courseManagement', 'courseCatalog'
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await AuthModel.getCurrentUser();
      if (mounted) {
        setUser(u);
        setCurrentView(u ? "home" : "publicHome");
      }
      setLoadingInit(false);
    })();
    return () => (mounted = false);
  }, []);

  const handleLogout = async () => {
    await AuthModel.logout();
    setUser(null);
    setCurrentView("publicHome");
  };
  const handleNavigateToCertificateList = () => {
    setCurrentView("certificateList");
    setSelectedCertificateId(null);
  };

  const handleNavigateToCertificateForm = (certId = null) => {
    setSelectedCertificateId(certId);
    setCurrentView("certificateForm");
  };

  const handleNavigateToCertificateDetail = (certId) => {
    setSelectedCertificateId(certId);
    setCurrentView("certificateDetail");
  };

  const handleCertificateSaved = () => {
    setRefreshToken((prev) => prev + 1);
    setCurrentView("certificateList");
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
        currentView === "publicHome" ? (
          <PublicHomeView onNavigateToLogin={() => setCurrentView("login")} />
        ) : (
          <LoginView
            onLogin={(u) => {
              setUser(u);
              setCurrentView("home");
            }}
            onBack={() => setCurrentView("publicHome")}
          />
        )
      ) : (
        <View style={{ flex: 1 }}>
          {currentView === "home" && (
            <HomeView
              user={user}
              onLogout={handleLogout}
              onNavigateToUserManagement={() =>
                setCurrentView("userManagement")
              }
              onNavigateToCourseManagement={() =>
                setCurrentView("courseManagement")
              }
                onNavigateToCourseCatalog={() => setCurrentView("courseCatalog")}
              onNavigateToCertificateList={handleNavigateToCertificateList}
            />
          )}
          {currentView === "userManagement" && (
            <UserManagementView
              user={user}
              onBack={() => setCurrentView("home")}
            />
          )}
          {currentView === "courseManagement" && (
            <CourseManagementView
              user={user}
              onBack={() => setCurrentView("home")}
            />
          )}
          {currentView === "courseCatalog" && (
            <CourseCatalogView
              user={user}
              onBack={() => setCurrentView("home")}
            />
            )}
            {currentView === "certificateList" && (
              <CertificateListView
                onNavigateToForm={handleNavigateToCertificateForm}
                onNavigateToDetail={handleNavigateToCertificateDetail}
                onBack={() => setCurrentView("home")}
                refreshToken={refreshToken}
              />
            )}
            {currentView === "certificateForm" && (
              <CertificateFormView
                certificateId={selectedCertificateId}
                onBack={() => setCurrentView("certificateList")}
                onSaved={handleCertificateSaved}
              />
            )}
            {currentView === "certificateDetail" && (
              <CertificateDetailView
                certificateId={selectedCertificateId}
                onBack={() => setCurrentView("certificateList")}
                onEdit={handleNavigateToCertificateForm}
                onSaved={handleCertificateSaved}
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
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#4F46E5",
  },
  sub: {
    marginBottom: 16,
    color: "#6B7280",
  },
});
