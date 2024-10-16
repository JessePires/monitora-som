import { Textarea } from '@/components/ui/textarea';

const NotesComponent = (): JSX.Element => {
  return (
    <div>
      <span>Anotações da sessão</span>
      <Textarea className="resize-none" />
    </div>
  );
};

export default NotesComponent;
