import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon, Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { HTMLInputTypeAttribute, useState } from "react";

export default function EditableField(props: {
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
}) {
  const {
    type = "text",
    value,
    placeholder,
    onChange,
    multiline = false,
    className,
    inputClassName,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const buttonStyle = "text-foreground/70 my-auto p-0 w-6 h-6";

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
    <div>
      {isEditing ? (
        <div className="flex items-center">
          {multiline ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn("bg-transparent border rounded-md p-1", inputClassName)}
            />
          ) : (
            <Input
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={inputClassName}
            />
          )}
          <Button
            className={cn(buttonStyle, "ml-2 text-green-600 hover:text-green-700")}
            size="icon"
            variant="ghost"
            onClick={handleSave}
          >
            <CheckIcon className="w-5 h-5" />
          </Button>
          <Button
            className={cn(buttonStyle, "ml-2 text-red-600 hover:text-red-700")}
            size="icon"
            variant="ghost"
            onClick={handleCancel}
          >
            <Cross2Icon className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div className={cn("relative flex gap-x-2", className)}>
          <span>{placeholder ?? value}</span>
          <Button
            className={buttonStyle}
            size="icon"
            variant="ghost"
            onClick={handleEdit}
          >
            <Pencil2Icon className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
