"use client"

import { useState } from "react"
import { User, Phone, AtSign, Lock, ChevronLeft, ChevronRight, Calendar, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import addPersonalisation from "@/actions/personalisation";
import { addDoctor } from "@/actions/doctor"
import { toast } from "sonner"

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

interface FormData {
  firstName: string
  lastName: string
  phoneNumber: string
  age: string
  gender: string
  email: string
  password: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  age?: string
  gender?: string
  email?: string
  password?: string
  [key: string]: string | undefined
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    age: "",
    gender: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "Please enter your first name"
    if (!formData.lastName.trim()) newErrors.lastName = "Please enter your last name"
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your phone number"
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }
    if (!formData.age.trim()) {
      newErrors.age = "Please enter your age"
    }
    if (!formData.gender.trim()) {
      newErrors.gender = "Please select your gender"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    // try{
    //   const res = await addPatient({ ...formData });
    //   if(res){
    //     toast.success("Registered as doctor successfully!");
    //   }else{
    //     toast.error("Failed to register as doctor. Please try again.");
    //     window.location.href = "/auth/login";
    //   }
    // } catch (error) {
    //   toast.error("Failed to register as doctor. Please try again.");
    //   window.location.href = "/auth/login";
    //   console.error(error);
    // }
    // if (validateForm()) {
    //   setShowQuestions(true)
    //   const currentQuestion = questions[currentQuestionIndex]
    //   setCurrentAnswer(questionAnswers[currentQuestion] || "")
    // }
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
  const handleDoctor = async () => {
  //  try{
  //    const res = await addDoctor({ ...formData });
  //    if(res){
  //     toast.success("Registered as doctor successfully!");
  //    }else{
  //     toast.error("Failed to register as doctor. Please try again.");
  //    }
  //  } catch (error) { 
  //   toast.error("Failed to register as doctor. Please try again.");
  //    console.error(error);
  //  }
  }

  const handleFinishQuestions = async () => {
    saveCurrentAnswer()
    setIsSubmitting(true)
    try {
      const res = await addPersonalisation({ ...formData }, questionAnswers)
      if (res) toast.success("Registration completed successfully!")
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }


  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg bg-white/80 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 rounded-3xl overflow-hidden relative">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-sm" />
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl">
          {showQuestions ? (
            <div className="p-8 space-y-8">
              <CardHeader className="space-y-4 text-center p-0">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto shadow-lg shadow-blue-500/25">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Health Assessment
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <div className="space-y-3">
                  <Progress value={progressPercentage} className="h-2 bg-gray-100 rounded-full overflow-hidden" />
                  <p className="text-xs text-gray-500 font-medium">{Math.round(progressPercentage)}% Complete</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-0">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-lg font-medium text-gray-800 leading-relaxed">{questions[currentQuestionIndex]}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer" className="text-sm font-medium text-gray-700">
                    Your Answer
                  </Label>
                  <Textarea
                    id="answer"
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Please provide your answer here..."
                    className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {isLastQuestion ? (
                    <Button
                      onClick={handleFinishQuestions}
                      disabled={isSubmitting || !currentAnswer.trim()}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 rounded-xl px-6 py-2 font-medium transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!currentAnswer.trim()}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 rounded-xl px-6 py-2 font-medium transition-all duration-200"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleNextQuestion}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 hover:bg-transparent rounded-xl py-1"
                >
                  Skip this question
                </Button>
              </CardContent>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              <CardHeader className="space-y-4 text-center p-0">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto shadow-lg shadow-blue-500/25">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Create Account
                  </CardTitle>
                  <p className="text-gray-600">Join us to get personalized health insights</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                          errors.firstName ? "border-red-300 focus:border-red-500" : ""
                        }`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs font-medium">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                          errors.lastName ? "border-red-300 focus:border-red-500" : ""
                        }`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs font-medium">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                        errors.email ? "border-red-300 focus:border-red-500" : ""
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                        errors.phoneNumber ? "border-red-300 focus:border-red-500" : ""
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-xs font-medium">{errors.phoneNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                      Age
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                          errors.age ? "border-red-300 focus:border-red-500" : ""
                        }`}
                        placeholder="25"
                      />
                    </div>
                    {errors.age && <p className="text-red-500 text-xs font-medium">{errors.age}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: string) => handleInputChange("gender", value)}
                    >
                      <SelectTrigger
                      className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                        errors.gender ? "border-red-300 focus:border-red-500" : ""
                      }`}
                      >
                      <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-xs font-medium">{errors.gender}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                        errors.password ? "border-red-300 focus:border-red-500" : ""
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password}</p>}
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Register as Patient
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <hr />
                <Button onClick={handleDoctor} className="w-full bg-gradient-to-r from-blue-500/40 to-indigo-600/60 hover:from-blue-600/60 hover:to-indigo-700/70 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.02]">Register as Doctor</Button>
              </CardContent>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
