import { getSession } from "@/lib/auth";
import { LessonView } from "@/components/LessonView";

export default async function CursoLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const user = (await getSession())!;

  return <LessonView lessonId={lessonId} user={user} />;
}
