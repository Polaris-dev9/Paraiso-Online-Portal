import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const RichTextEditor = ({ value, onChange }) => {
  const handleAction = (action) => {
    // This is a simplified placeholder. A real implementation would use a library like TipTap or Slate.
    let newValue = value;
    switch (action) {
      case 'bold':
        newValue += '**texto em negrito**';
        break;
      case 'italic':
        newValue += '*texto em itálico*';
        break;
      case 'underline':
        newValue += '__texto sublinhado__';
        break;
      case 'h2':
        newValue += '\n## Título\n';
        break;
      case 'ul':
        newValue += '\n- Item 1\n- Item 2';
        break;
      case 'ol':
        newValue += '\n1. Item 1\n2. Item 2';
        break;
      default:
        break;
    }
    onChange({ target: { id: 'content', value: newValue } });
  };

  return (
    <div className="border rounded-md border-gray-400 bg-white">
      <div className="p-2 border-b border-gray-400 flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={() => handleAction('bold')}><Bold size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleAction('italic')}><Italic size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleAction('underline')}><Underline size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleAction('h2')}><Heading2 size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleAction('ul')}><List size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleAction('ol')}><ListOrdered size={16} /></Button>
      </div>
      <Textarea
        id="content"
        value={value}
        onChange={onChange}
        className="w-full border-0 focus-visible:ring-0 rounded-t-none"
        rows={15}
        placeholder="Comece a escrever sua notícia aqui..."
      />
    </div>
  );
};

export default RichTextEditor;