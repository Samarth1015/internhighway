'use client';
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">NoteFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</span>
                  <UserButton />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <SignInButton mode="modal">
                    <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Transform Your</span>
            <span className="block text-indigo-600">Note-Taking Experience</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A modern, AI-powered note-taking application that helps you organize thoughts, 
            schedule tasks, and boost productivity with intelligent insights.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="space-y-3 sm:space-y-0 sm:space-x-3">
                <SignUpButton mode="modal">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Get Started
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        
      </main>
    </div>
  );
}
