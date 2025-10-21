import Link from 'next/link';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Track Your Progress, Achieve Your Goals
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive productivity app for tracking exercises, books, and personal growth
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Activity className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Exercise Tracking</h3>
            <p className="text-gray-600">
              Log your workouts, track calories, and monitor your fitness progress
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reading Progress</h3>
            <p className="text-gray-600">
              Track books, log reading sessions, and achieve your reading goals
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Posts</h3>
            <p className="text-gray-600">
              Share your achievements and inspire others with your journey
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personal Profile</h3>
            <p className="text-gray-600">
              Showcase your stats, achievements, and connect with others
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our App?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Free & Open Source</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Track Anytime, Anywhere</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">∞</div>
              <p className="text-gray-600">Unlimited Tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
