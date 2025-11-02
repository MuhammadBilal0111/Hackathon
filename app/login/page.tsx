'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Sparkles, ArrowRight, Github, Mail } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false)
      console.log('Login attempt:', { email, password })
    }, 2000)
  }

  return (
    <div className="min-h-[90vh] flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-green-600 via-lime-500 to-yellow-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-sm font-medium">
              <Sparkles className="w-5 h-5" />
              <span>Welcome Back</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Sign in to your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-lime-300 bg-clip-text text-transparent">
                account
              </span>
            </h1>
            <p className="text-lg text-green-100 max-w-md">
              Access your dashboard and continue your journey with us. We&apos;ve missed you!
            </p>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-40 right-40 w-20 h-20 bg-yellow-300/30 rounded-full blur-lg animate-bounce" />
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-lime-400/25 rounded-full blur-md" />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md space-y-3">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 pr-12 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-800 font-medium hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-gray-200 hover:bg-gray-50"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-gray-200 hover:bg-gray-50"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Google
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <a
                  href="#"
                  className="text-green-600 hover:text-green-800 font-medium hover:underline"
                >
                  Sign up for free
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}