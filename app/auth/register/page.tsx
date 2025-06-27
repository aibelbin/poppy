"use client"

import { useState } from "react"
import {
  User,
  Phone,
  ArrowRight,
  AtSign,
  RectangleEllipsis,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const questions = [
  "Do you have any known hereditary conditions?",
  "Has anyone in your immediate family been diagnosed with serious medical conditions?",
  "Have you ever undergone any major surgeries?",
  "Do you have any chronic illnesses or long-term medical conditions?",
  "Are you currently under medical treatment or taking any regular medications?",
  "Do you have a history of diabetes?",
  "Do you have high blood pressure?",
  "Do you have any known heart-related conditions?",
  "Do you have any known allergies?",
  "Have you ever had a severe allergic reaction?",
  "Have you been diagnosed with any mental health conditions?",
  "Do you smoke?",
  "Do you consume alcohol?",
  "How often do you engage in physical activity or exercise?",
  "What is your average sleep duration per night?",
  "Do you have a primary doctor or family physician?",
  "Do you have a preferred hospital or clinic for treatment?",
  "Do you have health insurance coverage?",
]

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    email: "",
    password: "",
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [showQuestions, setShowQuestions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  interface FormData {
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    email: string
    password: string
  }

  interface FormErrors {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    dateOfBirth?: string
    email?: string
    password?: string
    [key: string]: string | undefined
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: FormErrors) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please enter your first name"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please enter your last name"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your phone number"
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please enter a password"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowQuestions(true)
      const currentQuestion = questions[currentQuestionIndex]
      setCurrentAnswer(questionAnswers[currentQuestion] || "")
    }
  }

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value)
  }

  const saveCurrentAnswer = () => {
    if (currentAnswer.trim()) {
      const currentQuestion = questions[currentQuestionIndex]
      setQuestionAnswers((prev) => ({
        ...prev,
        [currentQuestion]: currentAnswer.trim(),
      }))
    }
  }

  const handleNextQuestion = () => {
    saveCurrentAnswer()
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      const nextQuestion = questions[nextIndex]
      setCurrentAnswer(questionAnswers[nextQuestion] || "")
    }
  }

  const handlePreviousQuestion = () => {
    saveCurrentAnswer()
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      const prevQuestion = questions[prevIndex]
      setCurrentAnswer(questionAnswers[prevQuestion] || "")
    }
  }

  const handleFinishQuestions = async () => {
    saveCurrentAnswer()
    setIsSubmitting(true)

    try {
      const registrationData = {
        personalInfo: formData,
        healthQuestions: questionAnswers,
      }
      // Submit registrationData to your backend here
      await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-2 sm:p-4">
      <div
        className={`
          ${showQuestions ? "w-full max-w-full sm:max-w-4xl" : "w-full max-w-full sm:max-w-lg"}
          bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 transition-all duration-500
        `}
      >
        {showQuestions ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-2 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Health Assessment</h1>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex flex-wrap justify-between text-xs sm:text-sm text-gray-600">
                  <span>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg sm:text-2xl text-gray-800 leading-relaxed">
                  {questions[currentQuestionIndex]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Please provide your answer here..."
                  className="min-h-[80px] sm:min-h-[120px] text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
                />
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 sm:pt-4 gap-2">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg bg-transparent"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </Button>
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                          index === currentQuestionIndex
                            ? "bg-blue-600 scale-125"
                            : index < currentQuestionIndex || questionAnswers[questions[index]]
                              ? "bg-green-500"
                              : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {isLastQuestion ? (
                    <Button
                      onClick={handleFinishQuestions}
                      disabled={isSubmitting || !currentAnswer.trim()}
                      className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!currentAnswer.trim()}
                      className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="text-center">
              <button onClick={handleNextQuestion} className="text-gray-500 hover:text-gray-700 underline text-xs sm:text-sm">
                Skip this question
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mx-auto mb-3 sm:mb-4 transition-all duration-300">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Create Your Account</h1>
              <p className="text-base sm:text-xl text-gray-600">Fill in your details to get started.</p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                  <User className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`
                    w-full h-12 sm:h-16 px-3 sm:px-5 text-base sm:text-xl border-2 sm:border-3 rounded-xl sm:rounded-2xl
                    focus:outline-none transition-all duration-200
                    ${errors.firstName
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500 bg-white"}
                  `}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-600 text-sm sm:text-lg mt-1 sm:mt-2 font-medium">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                  <User className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`
                    w-full h-12 sm:h-16 px-3 sm:px-5 text-base sm:text-xl border-2 sm:border-3 rounded-xl sm:rounded-2xl
                    focus:outline-none transition-all duration-200
                    ${errors.lastName
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500 bg-white"}
                  `}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-600 text-sm sm:text-lg mt-1 sm:mt-2 font-medium">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                  <Phone className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className={`
                    w-full h-12 sm:h-16 px-3 sm:px-5 text-base sm:text-xl border-2 sm:border-3 rounded-xl sm:rounded-2xl
                    focus:outline-none transition-all duration-200
                    ${errors.phoneNumber
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500 bg-white"}
                  `}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <p className="text-red-600 text-sm sm:text-lg mt-1 sm:mt-2 font-medium">{errors.phoneNumber}</p>}
              </div>
              <div>
                <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                  <AtSign className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`
                    w-full h-12 sm:h-16 px-3 sm:px-5 text-base sm:text-xl border-2 sm:border-3 rounded-xl sm:rounded-2xl
                    focus:outline-none transition-all duration-200
                    ${errors.email
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500 bg-white"}
                  `}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-600 text-sm sm:text-lg mt-1 sm:mt-2 font-medium">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                  <RectangleEllipsis className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`
                    w-full h-12 sm:h-16 px-3 sm:px-5 text-base sm:text-xl border-2 sm:border-3 rounded-xl sm:rounded-2xl
                    focus:outline-none transition-all duration-200
                    ${errors.password
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500 bg-white"}
                  `}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-600 text-sm sm:text-lg mt-1 sm:mt-2 font-medium">{errors.password}</p>}
              </div>
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={handleSubmit}
                  className="w-full h-14 sm:h-18 bg-blue-600 text-white text-xl sm:text-2xl font-bold rounded-xl sm:rounded-2xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
