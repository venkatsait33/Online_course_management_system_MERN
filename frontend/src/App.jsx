import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import BrowseCourses from './components/BrowseCourses'
import Instructor_Course_Management from './components/Instructor_Course_Management'
import CourseDetailPage from './components/course/CourseDetailPage'
import Student from './components/dashboard/Student'
import ProtectedRoute from './utils/ProtectedRoute'
import InstructorDashboard from './components/dashboard/InstructorDashboard'
import CreateCourse from './components/course/CreateCourse'
import Admin_Login from './pages/Admin_Login'
import Admin_Signup from './pages/Admin_Signup'
import AdminDashboard from './components/dashboard/AdminDashboard'
import InstructorProfile from './components/InstructorProfile'
import InstructorCourseDetailPage from './components/Instructor/InstructorCourseDetailPage'
import WatchLecture from './components/Instructor/WatchLecture'
import PageNotFound from './pages/PageNotFound'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/browse' element={<BrowseCourses />} />
        <Route path='/course_management' element={<ProtectedRoute><Instructor_Course_Management /></ProtectedRoute>} />
        <Route path='/course/:id' element={<CourseDetailPage />} />
        <Route path='/student/dashboard' element={
          <ProtectedRoute>
            <Student />
          </ProtectedRoute>
        } />
        <Route path='/instructor/dashboard' element={
          <ProtectedRoute>
            <InstructorDashboard />
          </ProtectedRoute>
        } />
        <Route path='/instructor/course/:id' element={<ProtectedRoute><InstructorCourseDetailPage /></ProtectedRoute>} />
        <Route path='/create-course' element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path='/admin/login' element={<Admin_Login />} />
        <Route path='/admin/signup' element={<Admin_Signup />} />
        <Route path='/admin-dashboard' element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/InstructorProfile/:id' element={<ProtectedRoute><InstructorProfile /></ProtectedRoute>} />
        <Route path=":courseId/lecture/:lectureId" element={<ProtectedRoute><WatchLecture /></ProtectedRoute>} />
        <Route path='*' element={<PageNotFound/>} />
      </Routes>

    </>
  )
}

export default App
