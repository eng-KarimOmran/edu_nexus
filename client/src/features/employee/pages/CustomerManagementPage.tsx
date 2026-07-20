import SearchClientForm from "../components/forms/SearchClientForm";
import ButtonAdd from "@/components/Table/ButtonAdd";
import type { ConfigDialog } from "@/store/DialogState";
import AddClientForm from "@/features/client/components/clientForm/AddClientForm";

export default function CustomerManagementPage() {
  const configDialog: ConfigDialog = {
    title: "إضافة عميل جديد",
    description: "قم بإدخال بيانات العميل.",
    children: <AddClientForm />,
  };

  return (
    <section dir="rtl" className="container mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">العملاء</h2>
          <p className="text-sm text-muted-foreground mt-1">
            اضافة و متابعة العملاء
          </p>
        </div>
        <ButtonAdd configDialog={configDialog} textBtn="إضافة عميل" />
      </header>

      <main className="rounded-lg border bg-card p-4 shadow-sm">
        <SearchClientForm />
      </main>
    </section>
  );
}