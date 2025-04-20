
import { useState, useEffect } from "react";
import { PlusCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";
import EditableSection from "@/components/EditableSection";

interface Section {
  id: string;
  type: "hero" | "text" | "image-text";
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    imageSrc?: string;
  };
}

interface SiteConfig {
  title: string;
  sections: Section[];
}

const defaultSections: Section[] = [
  {
    id: "hero",
    type: "hero",
    content: {
      title: "Добро пожаловать на мой сайт",
      subtitle: "Здесь вы можете отредактировать любой текст или изображение",
      imageSrc: "/placeholder.svg"
    }
  },
  {
    id: "section-" + Date.now(),
    type: "text",
    content: {
      title: "О нас",
      text: "Здесь вы можете рассказать о своей компании или проекте. Нажмите на текст, чтобы отредактировать его."
    }
  }
];

const defaultConfig: SiteConfig = {
  title: "Мой редактируемый сайт",
  sections: defaultSections
};

const Index = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultConfig);
  const [newSectionType, setNewSectionType] = useState<Section["type"]>("text");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  useEffect(() => {
    const savedConfig = localStorage.getItem("website-config");
    if (savedConfig) {
      setSiteConfig(JSON.parse(savedConfig));
    }
  }, []);
  
  const handleSaveWebsite = () => {
    localStorage.setItem("website-config", JSON.stringify(siteConfig));
    toast({
      title: "Сайт сохранен",
      description: "Все изменения сохранены в локальном хранилище браузера.",
    });
  };
  
  const updateSiteTitle = (title: string) => {
    setSiteConfig(prev => ({
      ...prev,
      title
    }));
  };
  
  const updateSectionContent = (sectionId: string, updates: Partial<Section["content"]>) => {
    setSiteConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, content: { ...section.content, ...updates } } 
          : section
      )
    }));
  };
  
  const addNewSection = () => {
    const newSection: Section = {
      id: "section-" + Date.now(),
      type: newSectionType,
      content: {}
    };
    
    switch (newSectionType) {
      case "hero":
        newSection.content = {
          title: "Новый заголовок",
          subtitle: "Новый подзаголовок",
          imageSrc: "/placeholder.svg"
        };
        break;
      case "text":
        newSection.content = {
          title: "Новый раздел",
          text: "Нажмите, чтобы отредактировать этот текст."
        };
        break;
      case "image-text":
        newSection.content = {
          title: "Заголовок с изображением",
          text: "Текст рядом с изображением. Нажмите для редактирования.",
          imageSrc: "/placeholder.svg"
        };
        break;
    }
    
    setSiteConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setShowAddDialog(false);
  };
  
  const deleteSection = (sectionId: string) => {
    setSiteConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };
  
  const renderSection = (section: Section) => {
    switch (section.type) {
      case "hero":
        return (
          <EditableSection 
            key={section.id} 
            id={section.id} 
            onDelete={deleteSection}
            canDelete={siteConfig.sections.length > 1}
          >
            <div className="flex flex-col items-center text-center py-10 px-4 gap-6">
              <EditableText
                initialText={section.content.title || "Заголовок"}
                tag="h1"
                className="text-4xl font-bold mb-2"
                onChange={text => updateSectionContent(section.id, { title: text })}
              />
              <EditableText
                initialText={section.content.subtitle || "Подзаголовок"}
                tag="h2"
                className="text-xl text-gray-600 mb-6"
                onChange={text => updateSectionContent(section.id, { subtitle: text })}
              />
              <EditableImage
                initialSrc={section.content.imageSrc || "/placeholder.svg"}
                alt="Основное изображение"
                className="max-w-lg w-full h-auto rounded-lg shadow-md"
                onChange={src => updateSectionContent(section.id, { imageSrc: src })}
              />
            </div>
          </EditableSection>
        );
      
      case "text":
        return (
          <EditableSection 
            key={section.id} 
            id={section.id} 
            onDelete={deleteSection}
            canDelete={siteConfig.sections.length > 1}
          >
            <div className="py-8 px-4">
              <EditableText
                initialText={section.content.title || "Заголовок раздела"}
                tag="h2"
                className="text-2xl font-bold mb-4"
                onChange={text => updateSectionContent(section.id, { title: text })}
              />
              <EditableText
                initialText={section.content.text || "Содержимое раздела"}
                tag="p"
                className="text-gray-600"
                onChange={text => updateSectionContent(section.id, { text: text })}
              />
            </div>
          </EditableSection>
        );
      
      case "image-text":
        return (
          <EditableSection 
            key={section.id} 
            id={section.id} 
            onDelete={deleteSection}
            canDelete={siteConfig.sections.length > 1}
          >
            <div className="flex flex-col md:flex-row gap-8 py-8 px-4 items-center">
              <div className="md:w-1/2">
                <EditableImage
                  initialSrc={section.content.imageSrc || "/placeholder.svg"}
                  alt="Изображение раздела"
                  className="w-full h-auto rounded-lg shadow-sm"
                  onChange={src => updateSectionContent(section.id, { imageSrc: src })}
                />
              </div>
              <div className="md:w-1/2">
                <EditableText
                  initialText={section.content.title || "Заголовок"}
                  tag="h2"
                  className="text-2xl font-bold mb-4"
                  onChange={text => updateSectionContent(section.id, { title: text })}
                />
                <EditableText
                  initialText={section.content.text || "Описание"}
                  tag="p"
                  className="text-gray-600"
                  onChange={text => updateSectionContent(section.id, { text: text })}
                />
              </div>
            </div>
          </EditableSection>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="group relative">
            <EditableText
              initialText={siteConfig.title}
              tag="h1"
              className="text-xl font-semibold"
              onChange={updateSiteTitle}
            />
          </div>
          <div className="flex gap-2">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" /> Добавить блок
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новый блок</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`border rounded-md p-4 text-center cursor-pointer transition-all hover:border-primary ${newSectionType === 'hero' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setNewSectionType('hero')}
                    >
                      <h3 className="font-medium">Заголовок</h3>
                      <p className="text-sm text-gray-500">Большой заголовок с изображением</p>
                    </div>
                    <div 
                      className={`border rounded-md p-4 text-center cursor-pointer transition-all hover:border-primary ${newSectionType === 'text' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setNewSectionType('text')}
                    >
                      <h3 className="font-medium">Текст</h3>
                      <p className="text-sm text-gray-500">Блок с текстовым содержимым</p>
                    </div>
                    <div 
                      className={`border rounded-md p-4 text-center cursor-pointer transition-all hover:border-primary ${newSectionType === 'image-text' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setNewSectionType('image-text')}
                    >
                      <h3 className="font-medium">Текст с картинкой</h3>
                      <p className="text-sm text-gray-500">Изображение + текст рядом</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Отмена</Button>
                  <Button onClick={addNewSection}>Добавить</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button onClick={handleSaveWebsite}>
              <Save className="h-4 w-4 mr-2" /> Сохранить сайт
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {siteConfig.sections.map(renderSection)}
        </div>
      </main>
      
      <footer className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} {siteConfig.title}</p>
          <p className="text-sm mt-2">Наведите курсор на любой блок и нажмите на иконки, чтобы редактировать или удалять содержимое.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
