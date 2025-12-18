import React from 'react';
import { Plus, Trash, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LinksManager = ({ links = [], onChange }) => {
  const addLink = () => {
    onChange([...links, { title: '', url: '' }]);
  };

  const removeLink = (index) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex gap-2 items-start bg-white p-3 border rounded-lg shadow-sm group">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
            <div className="space-y-1">
              <Input 
                placeholder="Título (ex: Veja mais aqui)" 
                value={link.title} 
                onChange={(e) => updateLink(index, 'title', e.target.value)}
                className="h-9 border-gray-300"
              />
            </div>
            <div className="space-y-1">
              <Input 
                placeholder="URL (http://...)" 
                value={link.url} 
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                className="h-9 border-gray-300"
              />
            </div>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => removeLink(index)}
            className="text-gray-400 hover:text-red-600 h-9 w-9 mt-0"
          >
            <Trash size={16} />
          </Button>
        </div>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={addLink}
        className="w-full border-dashed border-2 text-gray-600 hover:text-blue-600 hover:border-blue-300"
      >
        <Plus size={16} className="mr-2" /> Adicionar Link Relacionado
      </Button>
    </div>
  );
};

export default LinksManager;

