import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxLabelProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  icon: React.ReactNode;
}

const CheckboxLabel = ({
  id,
  label,
  description,
  checked,
  icon,
}: CheckboxLabelProps) => {
  return (
    <Label className="bg-white flex items-start gap-3 max-sm:gap-2 max-sm:landscape:gap-1 rounded-lg border p-3 max-sm:p-2 max-sm:landscape:p-1 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
      <Checkbox
        id={id}
        checked={checked}
        disabled
        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
      />
      <div className="grid gap-1.5 max-sm:gap-1 max-sm:landscape:gap-0.5 font-normal">
        <div className="flex items-center gap-2 max-sm:gap-1 max-sm:landscape:gap-0.5">
          {icon}
          <p className="text-sm max-sm:text-xs max-sm:landscape:text-xs leading-none font-medium">
            {label}
          </p>
        </div>
        <p className="text-muted-foreground text-sm max-sm:text-xs max-sm:landscape:text-xs max-sm:hidden max-sm:landscape:hidden">
          {description}
        </p>
      </div>
    </Label>
  );
};

export default CheckboxLabel;
