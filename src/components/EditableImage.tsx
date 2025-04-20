
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Check, X } from "lucide-react";

interface EditableImageProps {
  initialSrc: string;
  alt: string;
  className?: string;
  onChange?: (src: string) => void;
}

const EditableImage = ({ 
  initialSrc, 
  alt, 
  className = "",
  onChange 
}: EditableImageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [src, setSrc] = useState(initialSrc);
  const [tempSrc, setTempSrc] = useState(initialSrc);
  
  const handleEdit = () => setIsEditing(true);
  
  const handleSave = () => {
    setSrc(tempSrc);
    setIsEditing(false);
    if (onChange) {
      onChange(tempSrc);
    }
  };
  
  const handleCancel = () => {
    setTempSrc(src);
    setIsEditing(false);
  };
  
  return (
    <div className="group relative">
      {isEditing ? (
        <div className="flex flex-col gap-2 border rounded-md p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">URL изображения:</label>
            <input 
              type="text" 
              value={tempSrc}
              onChange={(e) => setTempSrc(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Вставьте URL изображения"
              autoFocus
            />
          </div>
          
          <div className="mt-2">
            <p className="text-sm mb-2">Предпросмотр:</p>
            {tempSrc ? (
              <img 
                src={tempSrc} 
                alt={alt} 
                className="max-h-40 max-w-full object-contain border rounded-md" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="h-40 w-full flex items-center justify-center bg-gray-100 rounded-md">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex gap-2 justify-end mt-2">
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
          <img 
            src={src || "/placeholder.svg"} 
            alt={alt} 
            className={className}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 bg-white/80" 
            onClick={handleEdit}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default EditableImage;
