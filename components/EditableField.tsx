import { HTMLInputTypeAttribute, useState } from "react";
import { Input } from "@/components/ui/input";
import { CheckIcon, Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export default function EditableField(props: {
  type: HTMLInputTypeAttribute;
  value: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  const {
    type,
    value,
    placeholder,
    onChange,
    multiline = false,
    className,
    inputClassName,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange(inputValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value);
  };

  return (
    <div className="relative w-full">
      {isEditing ? (
        <div className="flex items-center">
          {multiline ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn(
                "bg-transparent border rounded-md p-1",
                inputClassName
              )}
            />
          ) : (
            <Input
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={inputClassName}
            />
          )}
          <button
            className="ml-2 text-green-600 hover:text-green-700"
            onClick={handleSave}
          >
            <CheckIcon className="w-5 h-5" />
          </button>
          <button
            className="ml-2 text-red-600 hover:text-red-700"
            onClick={handleCancel}
          >
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className={cn("relative flex gap-x-2", className)}>
          <span>{placeholder ?? value}</span>
          <button
            className="transition-opacity text-foreground/70 hover:opacity-70 my-auto"
            onClick={handleEdit}
          >
            <Pencil2Icon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
