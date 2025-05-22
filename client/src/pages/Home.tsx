import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Record Podcasts with Confidence
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Zencast provides studio-quality remote recordings with automatic editing
        and cloud backup.
      </p>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          Login
        </Link>
      </div>
    </div>
  )
}

export default Home