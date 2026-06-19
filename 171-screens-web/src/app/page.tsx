import CourseSite from "@/components/CourseSite";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  return <CourseSite loggedIn={!!session} />;
}
