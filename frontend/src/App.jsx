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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/browse' element={<BrowseCourses />} />
        <Route path='/course_management' element={<Instructor_Course_Management />} />
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
        <Route path='/create-course' element={<CreateCourse />} />
      </Routes>

    </>
  )
}

export default App
