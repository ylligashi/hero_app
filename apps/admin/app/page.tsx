import { redirect } from "next/navigation";

export default function IndexPage() {
  // Redirect to the heroes page which is inside the protected layout
  redirect("/heroes");
}
