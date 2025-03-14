import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ShopEase</h1>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to ShopEase</h2>
          <p className="text-xl text-gray-600 mb-8">Your one-stop destination for all your shopping needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-lg"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-lg"
            >
              Login to Your Account
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2025 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

