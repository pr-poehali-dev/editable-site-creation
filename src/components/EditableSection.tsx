
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface EditableSectionProps {
  id: string;
  children: React.ReactNode;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

const EditableSection = ({ 
  id, 
  children, 
  onDelete,
  canDelete = true
}: EditableSectionProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setShowDeleteDialog(false);
  };
  
  return (
    <div className="group relative border border-transparent hover:border-gray-200 p-4 rounded-md transition-all">
      {children}
      
      {canDelete && onDelete && (
        <>
          <Button 
            variant="destructive" 
            size="icon" 
            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие удалит раздел и все его содержимое.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default EditableSection;
