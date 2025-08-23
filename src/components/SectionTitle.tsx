import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  subDescription?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const SectionTitle = ({
  title,
  icon,
  description,
  subDescription,
  className,
  titleClassName,
  descriptionClassName,
}: SectionTitleProps) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h1 className={cn("text-3xl font-bold text-gray-900", titleClassName)}>
          {title}
        </h1>
      </div>
      <div className={cn("text-gray-600 text-xl", descriptionClassName)}>
        <p>{description}</p>
        <p>{subDescription}</p>
      </div>
    </div>
  );
};

export default SectionTitle;
