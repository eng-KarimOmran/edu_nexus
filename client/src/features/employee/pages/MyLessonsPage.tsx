import { useQuery } from "@tanstack/react-query";
import { getAllLessons } from "../api/employee.service";
import type { GetAllLessonsDto } from "../employee.dto";
import { queryKey } from "../../lesson/lesson.constants";
import displayError from "@/lib/displayError";
import { useUserProfileState } from "@/store/UserDetailsState";
import { formatDate, getDateRange, type DateFilter } from "@/lib/formatDate";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";
import { enumTranslations } from "@/lib/enumTranslations";
import { Button } from "@/components/ui/button";
import {
  RiCarLine,
  RiGraduationCapLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiPhoneLine,
  RiUserLine,
} from "@remixicon/react";
import {
  GetContactLink,
  GetWhatsappLink,
} from "@/components/GetPhoneLinks/GetPhoneLinks";
import { useDialogState, type ConfigDialog } from "@/store/DialogState";
import ChangeLessonStateForm from "../components/forms/ChangeLessonStateForm";
import type { Lesson } from "../employee.type";
import EmptyState from "@/components/EmptyState/EmptyState";
import { LoadingList } from "@/components/Loading/Loading";

export default function MyLessonsPage({ date }: { date: DateFilter }) {
  const { startTime, endTime } = getDateRange(date);
  const { userProfile } = useUserProfileState();
  const { setConfigDialog } = useDialogState();

  const query: GetAllLessonsDto["query"] = {
    lessonStatus: "SCHEDULED",
    jobProfileId: userProfile?.jobProfile?.id,
    startTime,
    endTime,
  };

  const {
    isLoading,
    data = [],
    error,
  } = useQuery({
    queryKey: [...queryKey, "lesson-schedule", query.startTime],
    queryFn: () => getAllLessons({ query }),
    select: (res) => res.data.data,
    enabled: !!userProfile?.jobProfile,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <LoadingList count={10} />;
  }

  if (error) {
    displayError({ error, mes: "حدث خطأ اثناء جلب الحصص" });
  }

  const handleCompleteLesson = (lesson: Lesson) => {
    const configDialog: ConfigDialog = {
      title: "اكمال الحصة",
      description: "هذا الاجراء لا يمكن الرجوع",
      children: <ChangeLessonStateForm item={lesson} />,
    };
    setConfigDialog(configDialog);
  };

  if (data.length === 0) {
    return <EmptyState message="لا يوجد حصص" />;
  }

  return (
    <section className="space-y-6">
      {data.map((l) => (
        <Card key={l.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <span>موعد الحصة</span>
              <span>{formatDate(l.startTime, "time")}</span>
              <span>
                <BadgeDemo
                  type={l.lessonStatus}
                  text={enumTranslations[l.lessonStatus]}
                />
              </span>
            </CardTitle>
            <CardAction>
              <Button
                disabled={new Date(l.startTime) > new Date()}
                onClick={() => handleCompleteLesson(l)}
              >
                اكملت الحصة
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <RiUserLine />
                <span>الاسم:</span> {l.client.name}
              </li>
              <li className="flex items-center gap-2">
                <RiPhoneLine />
                <span>الهاتف:</span> {l.client.phone}
              </li>
              <li className="flex items-center gap-2">
                <RiMoneyDollarCircleLine />
                <span>المبلغ المتوقع سدادة:</span>
                {l.expectedPaymentAmount > 0
                  ? `${l.expectedPaymentAmount}ج.م`
                  : "لا يوجد"}
              </li>
              <li className="flex items-center gap-2">
                <RiMapPinLine />
                <span>المنطقة:</span> {l.area.name}
              </li>
              <li className="flex items-center gap-2">
                <RiCarLine />
                <span>السيارة:</span>
                {`${l.car.modelName} - (${l.car.plateNumber})`}
              </li>
              <li className="flex items-center gap-2">
                <RiGraduationCapLine />
                <span>الأكاديمية:</span> {l.academy.name}
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-1">
              <GetWhatsappLink phone={l.client.phone} />
              <GetContactLink variant="outline" phone={l.client.phone} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
