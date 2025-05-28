
import { useFormSubmission } from './hooks/useFormSubmission';
import { useXmlFileHandler } from './hooks/useXmlFileHandler';
import { useKeySearch } from './hooks/useKeySearch';
import { useBatchImport } from './hooks/useBatchImport';

export const useNotaFiscalForm = () => {
  const { handleSubmit: submitForm, isLoading: submitLoading } = useFormSubmission();
  const { handleFileUpload, isLoading: uploadLoading } = useXmlFileHandler();
  const { handleKeySearch, isLoading: searchLoading } = useKeySearch();
  const { handleBatchImport, isLoading: batchLoading } = useBatchImport();

  const isLoading = submitLoading || uploadLoading || searchLoading || batchLoading;

  const handleSubmit = async (data: any, resetForm?: () => void) => {
    return await submitForm(data, resetForm);
  };

  return {
    handleSubmit,
    handleFileUpload,
    handleKeySearch,
    handleBatchImport,
    isLoading
  };
};
