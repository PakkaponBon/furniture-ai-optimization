import Link from "next/link"

export const Navbar = () => {
  return (
    <>
      <nav className="flex gap-4 text-2xl justify-between">
        <div className="flex gap-4"> 
          <Link href="/">Home</Link>
          <Link href="/">About</Link>
        </div>

        <div className="flex gap-4">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </nav>
    </>
  )
}