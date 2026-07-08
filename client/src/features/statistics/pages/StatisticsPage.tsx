import CardDashboard from "@/components/CardDashboard/CardDashboard";
import { ChartBarLabel } from "@/components/ChartBarLabel/ChartBarLabel";
import { ChartPieLabel } from "@/components/ChartPieLabel/ChartPieLabel";
import { useActiveAcademyState } from "@/store/ActiveAcademyState";

import {
  RiBookOpenLine,
  RiMoneyDollarCircleLine,
  RiUserSearchFill,
} from "@remixicon/react";
import { useEffect, useState } from "react";
import { LoadingCards, LoadingCharts } from "@/components/Loading/Loading";
import EmptyState from "@/components/EmptyState/EmptyState";
import type { PageHeaderProps } from "@/components/PageHeader/PageHeader";
import PageHeader from "@/components/PageHeader/PageHeader";
import dayjs from "dayjs";
import { useStatistics } from "../api/statistics.query";
import type { DateFormProps } from "../components/statisticsForm/DateForm";
import DateFilterActions from "../components/DateFilterActions";
import displayError from "@/lib/displayError";
import { formatCompactNumber } from "@/lib/formatCompactNumber";

export default function StatisticsPage() {
  const { activeAcademy } = useActiveAcademyState();

  const academyId = activeAcademy?.id;

  const initialDateFilter: DateFormProps = {
    startDate: dayjs().startOf("day").toISOString(),
    endDate: dayjs().endOf("day").toISOString(),
  };

  const [date, setDate] = useState<DateFormProps>(initialDateFilter);

  const { data, isLoading, error } = useStatistics({
    academyId,
    startDate: date.startDate,
    endDate: date.endDate,
  });

  useEffect(() => {
    if (error) {
      displayError({ error, mes: "خطأ في تحميل الكورسات" });
    }
  }, [error]);

  const configHeader: PageHeaderProps = {
    title: "لوحة التحكم",
    description: "نظرة عامة على أداء الأكاديمية",
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader {...configHeader} />
        <LoadingCards count={3} />
        <LoadingCharts count={2} />
      </div>
    );
  }

  if (!data) {
    return <EmptyState message="لا توجد إحصاءات متاحة" />;
  }

  return (
    <section className="space-y-8">
      <div className="bg-sidebar flex rounded-md justify-between flex-wrap p-4 gap-1">
        <PageHeader {...configHeader} />

        <DateFilterActions
          setDate={setDate}
          date={date}
          initialDateFilter={initialDateFilter}
        />
      </div>

      <main className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardDashboard
            title="إجمالي الإيرادات"
            value={`${formatCompactNumber(data.ledgerTransaction.totalCollected)} ج.م`}
            subtext={`المسترجع: ${formatCompactNumber(data.ledgerTransaction.totalRefund)} ج.م`}
            icon={<RiMoneyDollarCircleLine />}
          />
          <CardDashboard
            title="إجمالي العملاء"
            value={formatCompactNumber(data.clients.totalClient)}
            subtext={`${formatCompactNumber(data.subscriptions.totalSubscription)} اجمالي الأشتركات`}
            icon={<RiUserSearchFill />}
          />
          <CardDashboard
            title="إجمالي الحصص"
            value={formatCompactNumber(data.lessons.totalLesson)}
            subtext={`${formatCompactNumber(data.lessons.lessonCompleted)} مكتملة`}
            icon={<RiBookOpenLine />}
          />
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            العملاء والحصص
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartPieLabel
              title="مصدر العملاء"
              description="عملاء المكتب مقابل عملاء الموقع"
              chartData={[
                {
                  label: "المكتب",
                  value: data.clients.officeCount,
                  fill: "var(--chart-1)",
                },
                {
                  label: "الموقع",
                  value: data.clients.platformCount,
                  fill: "var(--chart-2)",
                },
              ]}
            />
            <ChartPieLabel
              title="نوع الحصص"
              description="مانيوال مقابل أوتوماتيك"
              chartData={[
                {
                  label: "مانيوال",
                  value: data.lessons.lessonManual,
                  fill: "var(--chart-3)",
                },
                {
                  label: "أوتوماتيك",
                  value: data.lessons.lessonAutomatic,
                  fill: "var(--chart-4)",
                },
              ]}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            الإحصائيات المالية والاشتراكات
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartBarLabel
              title="حالة الاشتراك"
              description="حلات الاشتراكات"
              chartData={[
                {
                  label: "ملغي",
                  value: data.subscriptions.CANCELED,
                  fill: "var(--chart-1)",
                },
                {
                  label: "مكتمل",
                  value: data.subscriptions.COMPLETED,
                  fill: "var(--chart-1)",
                },
                {
                  label: "نشط",
                  value: data.subscriptions.ACTIVE,
                  fill: "var(--chart-1)",
                },
                {
                  label: "معلق",
                  value: data.subscriptions.SUSPENDED,
                  fill: "var(--chart-1)",
                },
                {
                  label: "فترة سماح",
                  value: data.subscriptions.GRACE_PERIOD,
                  fill: "var(--chart-1)",
                },
                {
                  label: "لم يبدأ",
                  value: data.subscriptions.PENDING_FIRST_SESSION,
                  fill: "var(--chart-1)",
                },
                {
                  label: "العربون",
                  value: data.subscriptions.PENDING_DEPOSIT,
                  fill: "var(--chart-1)",
                },
              ]}
            />
            <ChartBarLabel
              title="الحركة المالية"
              description="الكاش و المحفظة الألكترونيه"
              chartData={[
                {
                  label: "كاش",
                  value: data.ledgerTransaction.totalCash,
                  fill: "var(--chart-1)",
                },
                {
                  label: "محفطة",
                  value: data.ledgerTransaction.totalWallet,
                  fill: "var(--chart-1)",
                },
              ]}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            الحصص والكورسات
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartBarLabel
              title="حالة الحصص"
              description="توزيع الحصص حسب الحالة"
              chartData={[
                {
                  label: "ملغاة",
                  value: data.lessons.lessonCanceled,
                  fill: "var(--chart-1)",
                },
                {
                  label: "ملغاة برسوم",
                  value: data.lessons.lessonCanceledCharged,
                  fill: "var(--chart-2)",
                },
                {
                  label: "مكتملة",
                  value: data.lessons.lessonCompleted,
                  fill: "var(--chart-3)",
                },
                {
                  label: "مجدولة",
                  value: data.lessons.lessonScheduled,
                  fill: "var(--chart-4)",
                },
              ]}
            />
            <ChartBarLabel
              title="اشتراكات الكورسات"
              description="عدد المشتركين في كل كورس"
              chartData={data.courses.map((c, i) => ({
                label: c.name,
                value: c.count,
                fill: `var(--chart-${i + 1})`,
              }))}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            الكباتن و السكرتريات
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartBarLabel
              title="الكباتن"
              description="عدد الحصص التي أكملها الكباتن"
              chartData={data.captain.map((c, i) => ({
                label: `${c.name}-${c.phone}`,
                value: c.countLesson,
                fill: `var(--chart-${i + 1})`,
              }))}
            />
            <ChartBarLabel
              title="السكرتيرات"
              description="عدد الاشتراكات التي حققتها السكرتيرات"
              chartData={data.usersCreatedSubscription.map((s, i) => ({
                label: `${s.name}-${s.phone}`,
                value: s.countSubscription,
                fill: `var(--chart-${i + 1})`,
              }))}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            المناطق و السيارات
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartBarLabel
              title="المناطق"
              description="عدد الحصص التي تمت فى المناطق"
              chartData={data.area.map((a, i) => ({
                label: a.name,
                value: a.countLesson,
                fill: `var(--chart-${i + 1})`,
              }))}
            />
            <ChartBarLabel
              title="السيارات"
              description="عدد الحصص التي تمم على السيارات"
              chartData={data.car.map((c, i) => ({
                label: `${c.modelName}-${c.plateNumber}`,
                value: c.countLesson,
                fill: `var(--chart-${i + 1})`,
              }))}
            />
          </div>
        </div>
      </main>
    </section>
  );
}
