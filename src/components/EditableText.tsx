
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";

interface EditableTextProps {
  initialText: string;
  tag?: "h1" | "h2" | "h3" | "p";
  className?: string;
  onChange?: (text: string) => void;
}

const EditableText = ({ 
  initialText, 
  tag = "p", 
  className = "", 
  onChange 
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  
  const handleEdit = () => setIsEditing(true);
  
  const handleSave = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(text);
    }
  };
  
  const handleCancel = () => {
    setText(initialText);
    setIsEditing(false);
  };

  const Tag = tag as keyof JSX.IntrinsicElements;
  
  return (
    <div className="group relative">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={tag === "p" ? 3 : 1}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Отмена
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" /> Сохранить
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Tag className={className}>{text}</Tag>
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 absolute -right-10 top-0" 
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default EditableText;
