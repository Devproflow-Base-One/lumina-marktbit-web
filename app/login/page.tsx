export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 border border-border rounded-xl">
        <h1 className="text-3xl font-bold text-center text-foreground">Login</h1>
        <p className="text-center text-muted-foreground mt-2">Sign in to MarktBit</p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input type="email" className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <input type="password" className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
