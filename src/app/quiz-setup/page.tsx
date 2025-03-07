"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowUpTrayIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Mode = "select" | "upload";
type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "multiple choice" | "true/false";
type Category = "Science" | "History" | "Technology" | "Art" | "General";

interface FormDataState {
  difficulty: Difficulty;
  questionCount: number;
  type: QuestionType;
  category: Category;
}

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];
const typeOptions: QuestionType[] = ["multiple choice", "true/false"];
const categoryOptions: Category[] = [
  "Science",
  "History",
  "Technology",
  "Art",
  "General",
];

export default function QuizSetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("select");
  const [formData, setFormData] = useState<FormDataState>({
    difficulty: "medium",
    questionCount: 10,
    type: "multiple choice",
    category: "General",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "questionCount" ? Number(value) : value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please upload a valid .txt file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "upload" && !selectedFile) {
      setError("Please upload a file");
      return;
    }

    if (mode === "select") {
      router.push(
        `/quiz?${new URLSearchParams(
          formData as unknown as Record<string, string>
        ).toString()}`
      );
    } else {
      const formData = new FormData();
      formData.append("quizFile", selectedFile as Blob);
      router.push("/quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 text-gray-900">
            Quiz Setup
          </h1>

          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setMode("select")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                mode === "select"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Select Options
            </button>
            <button
              onClick={() => setMode("upload")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                mode === "upload"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Upload File
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "select" ? (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <label className="block mb-6">
                    <span className="flex items-center gap-2 text-gray-700 mb-3">
                      <AcademicCapIcon className="w-6 h-6" />
                      <span className="text-lg font-medium">Category</span>
                    </span>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block mb-6">
                    <span className="flex items-center gap-2 text-gray-700 mb-3">
                      <ChartBarIcon className="w-6 h-6" />
                      <span className="text-lg font-medium">Difficulty</span>
                    </span>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {difficultyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block mb-6">
                    <span className="flex items-center gap-2 text-gray-700 mb-3">
                      <DocumentTextIcon className="w-6 h-6" />
                      <span className="text-lg font-medium">Question Type</span>
                    </span>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {typeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-2 text-gray-700 mb-3">
                      <QuestionMarkCircleIcon className="w-6 h-6" />
                      <span className="text-lg font-medium">
                        Number of Questions
                      </span>
                    </span>
                    <input
                      type="number"
                      name="questionCount"
                      min="1"
                      max="50"
                      value={formData.questionCount}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept=".txt"
                    onChange={handleFileUpload}
                  />
                  <div className="text-center">
                    <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
                    <p className="text-gray-600">
                      {selectedFile
                        ? selectedFile.name
                        : "Upload your questions file (.txt)"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported format: Plain text file
                    </p>
                  </div>
                </label>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
            >
              Start Quiz
            </motion.button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
