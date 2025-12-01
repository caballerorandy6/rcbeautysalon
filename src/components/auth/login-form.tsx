"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { CircleNotch } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Show actual error message for email verification
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Invalid email or password. Please try again."
            : result.error
        toast.error("Login failed", {
          description: errorMessage,
        })
        return
      } else {
        toast.success("Login successful!", {
          description: "Redirecting to dashboard...",
        })
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.log("Login error:", error)
      toast.error("Login failed", {
        description: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-6 flex justify-center">
            <Logo size={144} />
          </div>
          <CardTitle className="text-center text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@rcbeautysalon.org"
                disabled={isSubmitting}
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                disabled={isSubmitting}
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <CircleNotch size={16} weight="bold" className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Create account
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                ← Back to home
              </Link>
            </div>

            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-foreground">Admin (Full Access):</p>
                  <p>admin@rcbeautysalon.org / admin123</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Staff (Staff Portal):</p>
                  <p>staff@rcbeautysalon.org / staff123</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Client (My Account):</p>
                  <p>cliente@rcbeautysalon.org / cliente123</p>
                </div>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
