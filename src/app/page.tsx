"use client";

import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  TrophyIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/Header";

const features = [
  {
    name: "Multiple Topics",
    description:
      "Choose from various categories including science, history, technology, and more",
    icon: DocumentTextIcon,
  },
  {
    name: "Instant Feedback",
    description:
      "Get immediate results and detailed explanations for every answer",
    icon: ClockIcon,
  },
  {
    name: "Score Tracking",
    description:
      "Monitor your progress and compete with others on our leaderboards",
    icon: TrophyIcon,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
            Test Your Knowledge with
          </h1>
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 block">
            QuizApp
          </span>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Challenge yourself with thousands of questions across diverse
            categories. Learn, compete, and track your progress.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            Start Quiz Now
            <ArrowRightIcon className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.name}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="bg-blue-600 text-white rounded-3xl p-6 sm:p-8 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Challenge Yourself?
          </h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base">
            Join thousands of learners improving their knowledge daily
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Browse Categories
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              View Leaderboard
            </motion.button>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-100 py-8 mt-12 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p className="text-sm sm:text-base">
            © 2024 QuizApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
