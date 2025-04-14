interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export function PageHeader({ heading, subheading, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{heading}</h1>
        {subheading && (
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{subheading}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}