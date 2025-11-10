import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginView from "./src/views/auth/LoginView";
import PublicHomeView from "./src/views/PublicHomeView";
import HomeView from "./src/views/HomeView";
import RegisterView from "./src/views/auth/RegisterView";
import UsersShell from "./src/views/users";
import CourseManagementView from "./src/views/courses/CourseManagementView";
import CourseCatalogView from "./src/views/courses/CourseCatalogView";
import MyCoursesView from "./src/views/courses/MyCoursesView";
import QuizzesListView from "./src/views/quizzes/QuizzesListView";
import ProfileView from "./src/views/profiles/ProfileView";
import MyFeedbacksView from "./src/views/feedbacks/MyFeedbacksView";
import AuthModel from "./src/models/AuthModel";
export default function App() {
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [currentView, setCurrentView] = useState("publicHome"); // 'publicHome', 'login', 'register', 'home', 'userManagement', 'courseManagement', 'courseCatalog', 'myCourses', 'profile', 'myFeedbacks'
  const [selectedCourseId, setSelectedCourseId] = useState(null); // For navigating to specific course feedback

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

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
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
          <PublicHomeView
            onNavigateToLogin={() => setCurrentView("login")}
            onNavigateToRegister={() => setCurrentView("register")}
          />
        ) : currentView === "register" ? (
          <RegisterView
            onBack={() => setCurrentView("publicHome")}
            onNavigateToLogin={() => setCurrentView("login")}
          />
        ) : (
          <LoginView
            onLogin={(u) => {
              setUser(u);
              setCurrentView("home");
            }}
            onBack={() => setCurrentView("publicHome")}
            onNavigateToRegister={() => setCurrentView("register")}
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
              onNavigateToQuizManagement={() =>
                setCurrentView("quizManagement")
              }
              onNavigateToMyCourses={() => setCurrentView("myCourses")}
              onNavigateToProfile={() => setCurrentView("profile")}
              onNavigateToMyFeedbacks={() => setCurrentView("myFeedbacks")}
            />
          )}
          {currentView === "userManagement" && (
            <UsersShell
              currentUser={user}
              onBack={() => setCurrentView("home")}
            />
          )}
          {currentView === "courseManagement" && (
            <CourseManagementView
              user={user}
              onBack={() => setCurrentView("home")}
            />
          )}
          {currentView === "quizManagement" && (
            <QuizzesListView
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
          {currentView === "myCourses" && (
            <MyCoursesView
              user={user}
              onBack={() => setCurrentView("home")}
              selectedCourseId={selectedCourseId}
              onClearSelectedCourse={() => setSelectedCourseId(null)}
            />
          )}
          {currentView === "profile" && (
            <ProfileView
              user={user}
              onBack={() => setCurrentView("home")}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
          {currentView === "myFeedbacks" && (
            <MyFeedbacksView
              user={user}
              onBack={() => setCurrentView("home")}
              onNavigateToCourse={(courseId) => {
                // Navigate to my courses and open feedback for that course
                setSelectedCourseId(courseId);
                setCurrentView("myCourses");
              }}
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
