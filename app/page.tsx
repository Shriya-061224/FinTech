import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to login page as the first step in the flow
  redirect("/login")
}
