"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Stethoscope,
  Calendar,
  Video,
  Phone,
  MessageSquare,
  Clock,
  User,
  FileText,
  Pill,
  Search,
  Bell,
  Settings,
  Play,
  Pause,
  Volume2,
  Download,
  Send,
  AlertTriangle,
  Users,
} from "lucide-react"

export default function DoctorDashboard() {
  const [activeVideoCall, setActiveVideoCall] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<RecentPatient | null>(null)
  const [isPlayingRecording, setIsPlayingRecording] = useState(false)

  const todayAppointments = [
    {
      id: 1,
      patient: "John Davis",
      time: "9:00 AM",
      type: "Regular Checkup",
      status: "completed",
      avatar: "JD",
      age: 72,
      condition: "Hypertension",
    },
    {
      id: 2,
      patient: "Mary Johnson",
      time: "10:30 AM",
      type: "Follow-up",
      status: "in-progress",
      avatar: "MJ",
      age: 68,
      condition: "Diabetes",
    },
    {
      id: 3,
      patient: "Robert Wilson",
      time: "2:00 PM",
      type: "Consultation",
      status: "upcoming",
      avatar: "RW",
      age: 75,
      condition: "Heart Disease",
    },
    {
      id: 4,
      patient: "Linda Brown",
      time: "3:30 PM",
      type: "Video Call",
      status: "upcoming",
      avatar: "LB",
      age: 70,
      condition: "Arthritis",
    },
  ]

  const patientRecordings = [
    {
      id: 1,
      patient: "John Davis",
      date: "Today, 8:30 AM",
      duration: "2:45",
      symptoms: "Chest pain, shortness of breath",
      priority: "high",
    },
    {
      id: 2,
      patient: "Mary Johnson",
      date: "Yesterday, 3:15 PM",
      duration: "1:30",
      symptoms: "Dizziness, fatigue",
      priority: "medium",
    },
    {
      id: 3,
      patient: "Robert Wilson",
      date: "Yesterday, 11:20 AM",
      duration: "3:10",
      symptoms: "Joint pain, stiffness",
      priority: "low",
    },
  ]

  const recentPatients = [
    {
      name: "John Davis",
      age: 72,
      lastVisit: "Today",
      condition: "Hypertension",
      medicationCompliance: 95,
      avatar: "JD",
    },
    {
      name: "Mary Johnson",
      age: 68,
      lastVisit: "2 days ago",
      condition: "Diabetes",
      medicationCompliance: 88,
      avatar: "MJ",
    },
    {
      name: "Robert Wilson",
      age: 75,
      lastVisit: "1 week ago",
      condition: "Heart Disease",
      medicationCompliance: 92,
      avatar: "RW",
    },
  ]

interface Appointment {
    id: number
    patient: string
    time: string
    type: string
    status: "completed" | "in-progress" | "upcoming" | string
    avatar: string
    age: number
    condition: string
}

interface PatientRecording {
    id: number
    patient: string
    date: string
    duration: string
    symptoms: string
    priority: "high" | "medium" | "low" | string
}

interface RecentPatient {
    name: string
    age: number
    lastVisit: string
    condition: string
    medicationCompliance: number
    avatar: string
}

const getStatusColor = (status: Appointment["status"]): string => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-800"
        case "in-progress":
            return "bg-blue-100 text-blue-800"
        case "upcoming":
            return "bg-yellow-100 text-yellow-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

interface PriorityColorMap {
    [key: string]: string
}

type Priority = "high" | "medium" | "low" | string

const getPriorityColor = (priority: Priority): string => {
    const colorMap: PriorityColorMap = {
        high: "border-red-200 bg-red-50",
        medium: "border-yellow-200 bg-yellow-50",
        low: "border-green-200 bg-green-50",
    }
    return colorMap[priority] || "border-gray-200 bg-gray-50"
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Doctor Portal</h1>
                <p className="text-xs md:text-sm text-blue-600">Patient Care Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-between md:justify-normal">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="w-full pl-8 md:pl-10 border-blue-200 focus:border-blue-400 text-sm"
                />
                <Search className="w-3 h-3 md:w-4 md:h-4 text-gray-400 absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="flex items-center space-x-1 md:space-x-4">
                <Button variant="ghost" size="icon" className="w-8 h-8 md:w-10 md:h-10 relative">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 md:w-10 md:h-10">
                  <Settings className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </Button>
                <Avatar className="w-8 h-8 md:w-10 md:h-10">
                  <AvatarImage src="/placeholder-doctor.jpg" alt="Doctor" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm md:text-base">DS</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Good Morning, Dr. Sarah</h2>
          <p className="text-sm md:text-xl text-gray-600">You have 4 appointments scheduled for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-xl md:text-3xl font-bold text-blue-600">4</p>
                </div>
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-xl md:text-3xl font-bold text-green-600">127</p>
                </div>
                <Users className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Voice Recordings</p>
                  <p className="text-xl md:text-3xl font-bold text-orange-600">3</p>
                </div>
                <Volume2 className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Urgent Alerts</p>
                  <p className="text-xl md:text-3xl font-bold text-red-600">1</p>
                </div>
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-blue-50 h-auto">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-white py-2 text-xs md:text-sm">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="recordings" className="data-[state=active]:bg-white py-2 text-xs md:text-sm">
              Voice Recordings
            </TabsTrigger>
            <TabsTrigger value="patients" className="data-[state=active]:bg-white py-2 text-xs md:text-sm">
              Patients
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-white py-2 text-xs md:text-sm">
              Video Conference
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4 md:space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
                  Today's Schedule
                </CardTitle>
                <CardDescription className="text-sm md:text-base">Manage your appointments and patient consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors gap-2 md:gap-0"
                    >
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <Avatar className="w-10 h-10 md:w-12 md:h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm md:text-base">{appointment.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base">{appointment.patient}</h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            {appointment.type} • Age {appointment.age} • {appointment.condition}
                          </p>
                          <p className="text-xs md:text-sm text-blue-600 font-medium">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-normal md:space-x-3">
                        <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace("-", " ")}
                        </Badge>
                        <div className="flex space-x-1 md:space-x-2">
                          <Button size="sm" variant="outline" className="h-8">
                            <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span className="hidden md:inline">Notes</span>
                          </Button>
                          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
                            <Video className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span className="hidden md:inline">Start Call</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4 md:space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 flex items-center">
                  <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
                  Patient Voice Recordings
                </CardTitle>
                <CardDescription className="text-sm md:text-base">Review symptom recordings from your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {patientRecordings.map((recording) => (
                    <div key={recording.id} className={`p-3 md:p-4 border rounded-lg ${getPriorityColor(recording.priority)}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-3 gap-2 md:gap-0">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base">{recording.patient}</h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            {recording.date} • Duration: {recording.duration}
                          </p>
                        </div>
                        <Badge
                          variant={recording.priority === "high" ? "destructive" : "secondary"}
                          className="capitalize text-xs"
                        >
                          {recording.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
                        <strong>Symptoms:</strong> {recording.symptoms}
                      </p>
                      <div className="flex flex-wrap gap-2 md:flex-nowrap md:items-center md:space-x-3">
                        <Button size="sm" variant="outline" className="h-8" onClick={() => setIsPlayingRecording(!isPlayingRecording)}>
                          {isPlayingRecording ? <Pause className="w-3 h-3 md:w-4 md:h-4 mr-1" /> : <Play className="w-3 h-3 md:w-4 md:h-4 mr-1" />}
                          {isPlayingRecording ? "Pause" : "Play"}
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                          <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          <span className="hidden md:inline">Download</span>
                        </Button>
                        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          <span className="hidden md:inline">Schedule</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-gray-900 flex items-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
                    Recent Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentPatients.map((patient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 md:p-3 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <Avatar className="w-8 h-8 md:w-10 md:h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs md:text-sm">{patient.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">{patient.name}</h3>
                            <p className="text-xs md:text-sm text-gray-600">
                              Age {patient.age} • {patient.condition}
                            </p>
                            <p className="text-xs text-blue-600">Last visit: {patient.lastVisit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Pill className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                            <span className="text-xs md:text-sm font-medium text-green-600">{patient.medicationCompliance}%</span>
                          </div>
                          <p className="text-xxs md:text-xs text-gray-500">Compliance</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedPatient && (
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl text-gray-900">Patient Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                      <Avatar className="w-12 h-12 md:w-16 md:h-16">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm md:text-lg">
                          {selectedPatient.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">{selectedPatient.name}</h3>
                        <p className="text-sm md:text-base text-gray-600">Age {selectedPatient.age}</p>
                        <p className="text-xs md:text-sm text-blue-600">{selectedPatient.condition}</p>
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between items-center p-2 md:p-3 bg-green-50 rounded-lg">
                        <span className="text-xs md:text-sm font-medium text-gray-700">Medication Compliance</span>
                        <span className="text-base md:text-lg font-bold text-green-600">
                          {selectedPatient.medicationCompliance}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-2 md:p-3 bg-blue-50 rounded-lg">
                        <span className="text-xs md:text-sm font-medium text-gray-700">Last Visit</span>
                        <span className="text-xs md:text-sm font-semibold text-blue-600">{selectedPatient.lastVisit}</span>
                      </div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <label className="text-xs md:text-sm font-medium text-gray-700">Quick Notes</label>
                      <Textarea
                        placeholder="Add notes about this patient..."
                        className="border-blue-200 focus:border-blue-400 text-sm min-h-[80px] md:min-h-[100px]"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 md:flex-nowrap md:space-x-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Video className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Video Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="video" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl text-gray-900 flex items-center">
                      <Video className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
                      Video Conference
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                      {activeVideoCall ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <Avatar className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2 md:mb-4">
                              <AvatarFallback className="bg-blue-600 text-white text-lg md:text-2xl">MJ</AvatarFallback>
                            </Avatar>
                            <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2">Mary Johnson</h3>
                            <p className="text-xs md:text-sm text-gray-300">Connected • 05:23</p>
                          </div>
                          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-20 h-16 md:w-32 md:h-24 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 md:w-8 md:h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <Video className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-2 md:mb-4" />
                            <p className="text-sm md:text-lg">No active video call</p>
                            <p className="text-xs md:text-sm">Start a call with your patient</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center space-x-2 md:space-x-4 mt-4 md:mt-6">
                      <Button
                        size="sm"
                        className={`w-10 h-10 md:w-14 md:h-14 rounded-full ${
                          activeVideoCall ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => setActiveVideoCall(!activeVideoCall)}
                      >
                        {activeVideoCall ? (
                          <Phone className="w-4 h-4 md:w-6 md:h-6 transform rotate-135" />
                        ) : (
                          <Video className="w-4 h-4 md:w-6 md:h-6" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-transparent">
                        <Volume2 className="w-4 h-4 md:w-6 md:h-6" />
                      </Button>
                      <Button size="sm" variant="outline" className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-transparent">
                        <MessageSquare className="w-4 h-4 md:w-6 md:h-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 md:space-y-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg text-gray-900">Waiting Patients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <Avatar className="w-7 h-7 md:w-8 md:h-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs md:text-sm">RW</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs md:text-sm font-medium">Robert Wilson</p>
                            <p className="text-xxs md:text-xs text-gray-600">Waiting 3 min</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Join
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <Avatar className="w-7 h-7 md:w-8 md:h-8">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs md:text-sm">LB</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs md:text-sm font-medium">Linda Brown</p>
                            <p className="text-xxs md:text-xs text-gray-600">Scheduled 3:30 PM</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call Notes */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg text-gray-900">Call Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 md:space-y-4">
                    <Textarea
                      placeholder="Take notes during the call..."
                      className="min-h-[80px] md:min-h-[100px] border-blue-200 focus:border-blue-400 text-sm"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Send className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}