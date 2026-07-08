export interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </header>
  );
}
