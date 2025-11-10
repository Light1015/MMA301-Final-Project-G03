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
import AssignmentListView from "./src/views/assignments/AssignmentListView";
import AuthModel from "./src/models/AuthModel";
import CertificateListView from "./src/views/certificates/CertificateListView";
import CertificateFormView from "./src/views/certificates/CertificateFormView";
import CertificateDetailView from "./src/views/certificates/CertificateDetailView";
import CouponListView from './src/views/coupons/CouponListView.js';
import CouponFormView from './src/views/coupons/CouponFormView.js';
import CouponDetailView from './src/views/coupons/CouponDetailView.js';
export default function App() {

  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // For navigating to specific course feedback
  const [currentView, setCurrentView] = useState("publicHome"); // 'publicHome', 'login', 'home', 'userManagement', 'courseManagement', 'courseCatalog', 'quizManagement', 'assignmentManagement'
  const [couponRefreshToken, setCouponRefreshToken] = useState(0);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

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
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Handle navigation to Coupon List
  const handleNavigateToCoupon = () => setCurrentView('couponList');

  // Handle navigation to Coupon Form (Create/Edit)
  const handleNavigateToCouponForm = (couponId = null) => {
    setSelectedCouponId(couponId);
    setCurrentView('couponForm');
  };

  const handleNavigateToCouponDetail = (couponId) => {
    setSelectedCouponId(couponId);
    setCurrentView('couponDetail');
  };
  const handleBackToDashboard = () => setCurrentView('home');
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
              onNavigateToCertificateList={handleNavigateToCertificateList}

              onNavigateToCourseCatalog={() => setCurrentView("courseCatalog")}
              onNavigateToQuizManagement={() =>
                setCurrentView("quizManagement")
              }
              onNavigateToMyCourses={() => setCurrentView("myCourses")}
              onNavigateToProfile={() => setCurrentView("profile")}
              onNavigateToMyFeedbacks={() => setCurrentView("myFeedbacks")}
              onNavigateToAssignmentManagement={() => setCurrentView("assignmentManagement")}
              onNavigateToCoupon={() => setCurrentView("couponList")}
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
          {currentView === "assignmentManagement" && (
            <AssignmentListView user={user} onBack={() => setCurrentView("home")} />
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
          {currentView === "couponList" && (
            <CouponListView
              onNavigateToForm={handleNavigateToCouponForm}
              onViewDetail={handleNavigateToCouponDetail}
              onBack={handleBackToDashboard}
              key={couponRefreshToken}
            />
          )}
          {currentView === "couponForm" && (
            <CouponFormView
              couponId={selectedCouponId}
              onBack={handleNavigateToCoupon}
              onSaved={() => {
                setCouponRefreshToken(t => t + 1);
                handleNavigateToCoupon();
              }}
            />
          )}

          {currentView === "couponDetail" && (
            <CouponDetailView
              couponId={selectedCouponId}
              onBack={handleNavigateToCoupon}
              onEdit={handleNavigateToCouponForm}
              onSaved={() => {
                setCouponRefreshToken(t => t + 1);
                handleNavigateToCoupon();
              }}
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
