import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterPage from "./RegisterPage";

export default async function SignupPage() {
  const session = await auth();

  if (session) {
    redirect("/profile");
  }

  return <RegisterPage />;
}