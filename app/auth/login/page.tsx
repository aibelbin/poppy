
"use client"

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import {login} from "@/actions/auth";
import Cookies from "js-cookie";
import { toast } from "sonner"
export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     setIsLoading(true);
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return
    }
   try{
     const response = await login(email, password);
    if (response.success) {
      toast.success("Login successful!");
      Cookies.set("type", response.type, { expires: 7 });
      Cookies.set("userId", response.id, { expires: 7 });
      Cookies.set("phoneNumber", response.phoneNumber ?? "", { expires: 7 });
      Cookies.set("name", response.name, { expires: 7 });
      Cookies.set("email", response.email ?? "", { expires: 7 });

      Cookies.set("token", response.token, { expires: 7 }); 
     if(response.type==="doctor") {
        window.location.href = "/doctor";
      } else {
        window.location.href = "/";
      }
    } else {
      setIsLoading(false);
      toast.error( "Login failed. Please try again.");
    }
   }catch (error) {
    setIsLoading(false);
    console.error("Login error:", error);
    toast.error("An error occurred during login. Please try again later.");
   }

   setTimeout(() => setIsLoading(false), 2000)
  }
  
  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-white overflow-clip">
      <Card className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white-500/20 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-black">Welcome Back</CardTitle>
          <CardDescription className="text-black-300">Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white-500/30 text-black placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-black-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/10 border-green-500/30 text-black placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-black hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-green-500/20" />
            </div>
           
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function loginUser(email: string, password: string) {
    throw new Error("Function not implemented.");
}
