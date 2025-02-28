"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Fireworks from "@/components/Fireworks";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
  type: string;
}

interface Answer {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [paramsLoaded, setParamsLoaded] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const difficulty = useMemo(
    () => searchParams?.get("difficulty") || "medium",
    [searchParams]
  );
  const questionCount = useMemo(() => {
    const count = Number(searchParams?.get("questionCount"));
    return count > 0 && count <= 50 ? count : 10;
  }, [searchParams]);
  const type = useMemo(
    () => searchParams?.get("type") || "multiple choice",
    [searchParams]
  );
  const category = useMemo(
    () => searchParams?.get("category") || "General",
    [searchParams]
  );

  useEffect(() => {
    if (searchParams) setParamsLoaded(true);
  }, [searchParams]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://opentdb.com/api.php?amount=${questionCount}&category=${getCategoryId(
          category
        )}&difficulty=${difficulty}&type=${getType(type)}`;

        const response = await fetch(apiUrl, {
          signal: abortController.signal,
        });
        const data = await response.json();

        if (data.response_code === 0) {
          const formattedQuestions = data.results.map((question: Question) => ({
            question: decodeHtmlEntities(question.question),
            correct_answer: decodeHtmlEntities(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(
              (answer: string) => decodeHtmlEntities(answer)
            ),
            category: question.category,
            difficulty: question.difficulty,
            type: question.type,
          }));
          setQuestions(formattedQuestions);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching questions:", error);
          setQuestions([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (paramsLoaded) {
      fetchQuestions();
    }

    return () => abortController.abort();
  }, [category, difficulty, questionCount, type, paramsLoaded]);

  const getCategoryId = (category: string) => {
    const categoryMap: Record<string, number> = {
      Science: 17,
      History: 23,
      Technology: 18,
      Art: 25,
      General: 9,
    };
    return categoryMap[category] || 9;
  };

  const getType = (type: string) => {
    const typeMap: Record<string, string> = {
      "multiple choice": "multiple",
      "true/false": "boolean",
    };
    return typeMap[type] || "multiple";
  };

  const decodeHtmlEntities = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffledAnswers = useMemo(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      return shuffleArray([
        ...questions[currentQuestionIndex].incorrect_answers,
        questions[currentQuestionIndex].correct_answer,
      ]);
    }
    return [];
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (isAnswerSelected || !questions.length) return;
      setIsAnswerSelected(true);

      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correct_answer;

      setUserAnswers((prev) => [
        ...prev,
        {
          questionIndex: currentQuestionIndex,
          answer: answer || "",
          isCorrect,
        },
      ]);

      if (isCorrect) setScore((prev) => prev + 1);

      setShowCorrectAnswer(true);
    },
    [currentQuestionIndex, isAnswerSelected, questions]
  );

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(60);
      setIsAnswerSelected(false);
      setShowCorrectAnswer(false);
    } else {
      setShowResults(true);
    }
  };

  useEffect(() => {
    if (!loading && !showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isAnswerSelected) {
      handleAnswerSelect("");
    }
  }, [timeLeft, loading, showResults, isAnswerSelected, handleAnswerSelect]);

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
    setTimeLeft(60);
    setIsAnswerSelected(false);
    setShowCorrectAnswer(false);
  };

  if (loading || !paramsLoaded) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-xl text-gray-600">Loading questions...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-xl text-red-600">
            No questions found. Please try different parameters.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {showResults && score === questions.length && (
        <Fireworks trigger={score === questions.length} />
      )}

      <main className="container mx-auto px-4 sm:px-6 py-12">
        {!showResults ? (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl mx-auto py-20"
          >
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Time left:</span>
                <span className="font-medium text-blue-600">{timeLeft}s</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-6">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {shuffledAnswers.map((answer, index) => (
                <motion.button
                  key={index}
                  disabled={isAnswerSelected}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 text-left rounded-lg border transition-colors 
                    ${
                      isAnswerSelected
                        ? answer === currentQuestion.correct_answer
                          ? "border-green-500 bg-green-50"
                          : "border-red-200 bg-red-50"
                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => handleAnswerSelect(answer)}
                >
                  {answer}
                </motion.button>
              ))}
            </div>

            {showCorrectAnswer && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">
                  Correct Answer: {currentQuestion.correct_answer}
                </p>
              </div>
            )}

            {isAnswerSelected && (
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Quiz Results</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <p className="text-4xl font-bold text-blue-600 mb-4">
                {score}/{questions.length}
              </p>
              <p className="text-xl text-gray-600 mb-6">
                {score >= questions.length * 0.8
                  ? "Excellent! 🎉"
                  : score >= questions.length * 0.5
                  ? "Good job! 👍"
                  : "Keep practicing! 💪"}
              </p>

              <div className="space-y-4 text-left">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">{question.question}</p>
                    <p
                      className={`text-sm ${
                        userAnswers[index]?.isCorrect
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Your answer: {userAnswers[index]?.answer || "Unanswered"}{" "}
                      -{" "}
                      {userAnswers[index]?.answer
                        ? userAnswers[index].isCorrect
                          ? "Correct"
                          : "Incorrect"
                        : "Incorrect (Unanswered)"}
                    </p>
                    {!userAnswers[index]?.isCorrect && (
                      <p className="text-sm text-gray-600 mt-1">
                        Correct answer: {question.correct_answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700"
              onClick={restartQuiz}
            >
              Restart Quiz
            </motion.button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
