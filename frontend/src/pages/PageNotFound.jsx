import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <h1 className="mb-4 text-6xl font-bold text-red-600">404</h1>
          <p className="mb-4 text-2xl text-gray-700">Oops! Page not found</p>
          <p className="mb-8 text-gray-500">The page you are looking for does not exist.</p>
          <Link
              to="/"
              className="px-6 py-3 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
              Go Back Home
          </Link>
      </div>
  )
}

export default PageNotFound