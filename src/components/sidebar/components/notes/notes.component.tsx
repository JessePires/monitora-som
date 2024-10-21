import { Textarea } from '@/components/ui/textarea';

const NotesComponent = (): JSX.Element => {
  return (
    <div>
      <span className="text-gray-800">Anotações da sessão</span>
      <Textarea className="resize-none text-gray-800" />
    </div>
  );
};

export default NotesComponent;
