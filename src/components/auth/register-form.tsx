"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { CircleNotch } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { registerUser } from "@/app/actions/auth"

export function RegisterForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    const result = await registerUser(data)

    if (!result.success) {
      const errorMessage =
        result.errors?.[0]?.message || "Registration failed. Please try again."
      toast.error("Registration failed", {
        description: errorMessage,
      })
      return
    }

    toast.success("Account created successfully!", {
      description: "Please check your email to verify your account before logging in.",
      duration: 6000,
    })

    router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-6 flex justify-center">
            <Logo size={144} />
          </div>
          <CardTitle className="text-center text-2xl">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                disabled={isSubmitting}
                autoComplete="name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                disabled={isSubmitting}
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={isSubmitting}
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                disabled={isSubmitting}
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircleNotch
                    size={16}
                    weight="bold"
                    className="mr-2 animate-spin"
                  />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <Separator />

            <div className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                ← Back to home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
