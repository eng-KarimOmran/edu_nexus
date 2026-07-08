import { useQuery } from "@tanstack/react-query";
import { getAllLessons } from "../api/employee.service";
import type { GetAllLessonsDto } from "../employee.dto";
import { queryKey } from "../../lesson/lesson.constants";
import dayjs from "dayjs";
import displayError from "@/lib/displayError";
import type { Lesson } from "../employee.type";
import { lessonColumns } from "../config/employee.columns";
import TableUi from "@/components/Table/TableUi";
import { formatArabicDayAndDate } from "@/lib/formatDate";
import { LoadingList } from "@/components/Loading/Loading";
import EmptyState from "@/components/EmptyState/EmptyState";

export default function GetAllLessonsPage() {
  const startTime = dayjs().startOf("day").toDate();
  const endTime = dayjs().add(7, "day").endOf("day").toDate();

  const query: GetAllLessonsDto["query"] = {
    lessonStatus: "SCHEDULED",
    startTime,
    endTime,
  };

  const {
    isLoading,
    data = [],
    error,
  } = useQuery({
    queryKey: [queryKey, "lesson-schedule", startTime],
    queryFn: () => getAllLessons({ query }),
    select: (res) => res.data.data,
  });

  if (isLoading) {
    return <LoadingList count={10} />;
  }

  if (error) {
    displayError({ error, mes: "حدث خطأ اثناء جلب الحصص" });
  }

  if (data.length === 0) {
    return <EmptyState message="لا يوجد حصص" />;
  }

  const groupedLessons = new Map<string, Lesson[]>();

  data.forEach((lesson) => {
    const key = dayjs(lesson.startTime).format("YYYY-MM-DD");
    groupedLessons.set(key, [...(groupedLessons.get(key) ?? []), lesson]);
  });

  const lessonsTables = Array.from(groupedLessons.entries()).map(
    ([date, lessons]) => ({
      title: formatArabicDayAndDate(date),
      data: lessons,
      headers: lessonColumns,
    }),
  );

  return (
    <section className="space-y-6">
      {lessonsTables.map(({ title, ...table }) => (
        <div key={title}>
          <h2 className="mb-4 text-xl font-bold">{title}</h2>
          <TableUi {...table} />
        </div>
      ))}
    </section>
  );
}
