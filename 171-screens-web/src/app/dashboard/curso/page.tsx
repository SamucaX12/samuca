import { getSession } from "@/lib/auth";
import { getLessonCounts } from "@/lib/lessons";
import { CourseHub } from "@/components/CourseHub";

export default async function CursoHubPage() {
  const user = (await getSession())!;
  const counts = getLessonCounts();
  return <CourseHub user={user} counts={counts} />;
}
