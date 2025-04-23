import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { DialogClose } from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';

export function DeleteUser({ closeModal }: {closeModal: () => void}) {
    
    const navigate = useNavigate()
    const {deleteUser} = useUser()

  return (
    <Dialog open={true} onOpenChange={() => {}}>

      <DialogContent size={"xsm"}>
      <DialogClose asChild>
            <button
            className="absolute right-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
            onClick={closeModal}
            >
            X
            </button>
        </DialogClose>
      <DialogHeader>
          <DialogTitle>Tem certeza que deseja desativar sua conta?</DialogTitle>
        </DialogHeader>
        <p>Ao desativar sua conta, todos os seus dados e histórico de atividades serão permanentemente removidos. <b>Esta ação é irreversível e não poderá ser desfeita.</b></p>
        <div className="flex justify-end space-x-4 mt-4">
          <div className="flex justify-center">
            <Button variant={'outline'} onClick={closeModal} size={"sm"}>
                Cancelar
            </Button></div>
          <div className="flex justify-center">
            <Button variant={"destructive"} onClick={() => {
                deleteUser
                closeModal
                navigate('/login')
            }} size={"sm"}>
                Desativar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
