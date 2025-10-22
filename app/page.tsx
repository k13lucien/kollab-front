import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-balance">
          Welcome to <span className="text-primary">TaskFlow</span>
        </h1>
        <p className="text-xl text-muted-foreground text-pretty">
          Collaborative task management for modern teams. Organize projects, assign tasks, and track progress all in one
          place.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
