
import React from 'react';
import { Form } from '@/components/ui/form';
import { SolicitacaoColeta } from '../../types/coleta.types';
import { FormData } from './formSchema';
import { ObservacoesField } from './fields/ObservacoesField';
import { RejeicaoFields } from './fields/RejeicaoFields';
import { AprovacaoActions } from './actions/AprovacaoActions';
import { useAprovacaoForm } from './hooks/useAprovacaoForm';

interface AprovacaoFormProps {
  selectedRequest: SolicitacaoColeta;
  isRejecting: boolean;
  setIsRejecting: (value: boolean) => void;
  onClose: () => void;
  onApprove: (solicitacaoId: string, observacoes?: string) => void;
  onReject: (solicitacaoId: string, motivoRecusa: string) => void;
}

const AprovacaoForm: React.FC<AprovacaoFormProps> = ({
  selectedRequest,
  isRejecting,
  setIsRejecting,
  onClose,
  onApprove,
  onReject
}) => {
  const { 
    form, 
    handleSubmit, 
    handleApproveClick 
  } = useAprovacaoForm({
    selectedRequest,
    isRejecting,
    setIsRejecting,
    onClose,
    onApprove,
    onReject
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ObservacoesField form={form} />
        <RejeicaoFields isRejecting={isRejecting} form={form} />
        
        <AprovacaoActions
          isRejecting={isRejecting}
          setIsRejecting={setIsRejecting}
          onClose={onClose}
          handleApproveClick={handleApproveClick}
        />
      </form>
    </Form>
  );
};

export default AprovacaoForm;
