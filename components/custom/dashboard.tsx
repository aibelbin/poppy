"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Pill,
  Calendar,
  Mic,
  Phone,
  MessageSquare,
  Bell,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Camera,
  Upload,
  X,
  Loader2,
} from "lucide-react"
import detectMed from "@/actions/detectMed"

export default function MeditationApp() {
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mark, setMark] = useState(false)
  const [detectedMedicines, setDetectedMedicines] = useState<
    Array<{
      name: string
      confidence: number
      dosage?: string
      warnings?: string[]
    }>
  >([])
  const [dragActive, setDragActive] = useState(false)

  const [upcomingMeds, setUpcomingMeds] = useState([
    { name: "Blood Pressure Medication", time: "2:00 PM", taken: false },
    { name: "Vitamin D", time: "6:00 PM", taken: false },
    { name: "Heart Medication", time: "8:00 PM", taken: false },
  ])


  const todaysMeds = [
    { name: "Morning Vitamins", time: "8:00 AM", taken: true },
    { name: "Diabetes Medication", time: "12:00 PM", taken: true },
  ]

  useEffect(() => {
    const detectMedicine = async () => {
      if (uploadedImage) {
        setIsAnalyzing(true)
        const med = await detectMed(uploadedImage!);
        console.log(med)
        setDetectedMedicines(med);
        setIsAnalyzing(false)
      }
    }
    detectMedicine();
  }, [uploadedImage]);

  const handleImageUpload = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result?.toString().split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const data = await promise.then((data: any) => data);
      setUploadedImage(data)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files[0])
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setDetectedMedicines([])
    setIsAnalyzing(false)
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">POPPY</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="w-12 h-12">
                <Bell className="w-6 h-6 text-blue-600" />
              </Button>
              <Button variant="ghost" size="icon" className="w-12 h-12">
                <Settings className="w-6 h-6 text-blue-600" />
              </Button>
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Good Morning</h2>
          <p className="text-xl text-gray-600">How are you feeling today?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Pill className="w-6 h-6 text-blue-600 mr-2" />
                  Today's Medications
                </CardTitle>
                <CardDescription className="text-base">Keep track of your medicine schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysMeds.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Taken
                    </Badge>
                  </div>
                ))}
                {upcomingMeds.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.time}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        setUpcomingMeds((prev) =>
                          prev.map((m, i) =>
                            i === index ? { ...m, taken: true } : m
                          )
                        )
                      }
                      className={`bg-blue-600 hover:bg-blue-700 ${med.taken ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={med.taken}
                    >
                      {med.taken ? "Taken" : "Mark as Taken"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Mic className="w-6 h-6 text-blue-600 mr-2" />
                  Ai Assistnace
                </CardTitle>
                <CardDescription className="text-base">
                  Describe your symptoms to help doctors understand your condition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-colors ${isRecording ? "bg-red-100 border-4 border-red-300" : "bg-blue-100 border-4 border-blue-300"
                      }`}
                  >
                    <Mic className={`w-16 h-16 ${isRecording ? "text-red-600" : "text-blue-600"}`} />
                  </div>
                  <Button
                    size="lg"
                    className={`text-lg px-8 py-4 ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? "Calling your Ai Assistant" : "Call your Ai Assistant"}
                  </Button>
                  <p className="text-sm text-gray-600">
                    {isRecording ? "Recording your symptoms..." : "Tap to start recording your symptoms"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center">
                  <Camera className="w-5 h-5 text-blue-600 mr-2" />
                  Medicine Detection
                </CardTitle>
                <CardDescription>Upload a photo to identify your medicines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!uploadedImage ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Drop your image here</p>
                        <p className="text-xs text-gray-500">or click to browse</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={`data:image/png;base64,${uploadedImage}` || "/placeholder.svg"}
                        alt="Uploaded medicine"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 w-8 h-8"
                        onClick={clearImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {isAnalyzing ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">Analyzing medicine...</span>
                      </div>
                    ) : detectedMedicines.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Detected Medicines:</h4>
                        {detectedMedicines.map((medicine, index) => (
                          <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{medicine.name}</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {medicine.confidence}% match
                              </Badge>
                            </div>
                            {medicine.dosage && <p className="text-sm text-gray-600 mb-1">{medicine.dosage}</p>}
                            {medicine.warnings && medicine.warnings.length > 0 && (
                              <div className="text-xs text-orange-600">
                                <strong>Warnings</strong>
                                {medicine.warnings.map((warning, index) => (
                                  <div key={index} className="text-xs text-orange-600">
                                    {index + 1}. {warning}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  Next Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder-user.jpg" alt="Doctor" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Stethoscope className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">Dr. Jaison Johnson</p>
                      <p className="text-sm text-gray-600">Cardiologist</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Tomorrow, 2:30 PM</p>
                    <p className="text-xs text-blue-700">Regular checkup</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 text-blue-600 mr-2" />
                  Alert Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">SMS Alerts</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Call Reminders</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Emergency Contact</h3>
                  <p className="text-sm text-red-700">Available 24/7 for urgent medical assistance</p>
                </div>
              </div>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
