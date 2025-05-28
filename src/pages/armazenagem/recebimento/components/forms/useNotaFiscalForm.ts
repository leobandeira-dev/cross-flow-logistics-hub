
import { useFormSubmission } from './hooks/useFormSubmission';
import { useXmlFileHandler } from './hooks/useXmlFileHandler';
import { useKeySearch } from './hooks/useKeySearch';
import { useBatchImport } from './hooks/useBatchImport';

export const useNotaFiscalForm = () => {
  const { handleSubmit, isLoading: submitLoading } = useFormSubmission();
  const { handleFileUpload, isLoading: uploadLoading } = useXmlFileHandler();
  const { handleKeySearch, isLoading: searchLoading } = useKeySearch();
  const { handleBatchImport, isLoading: batchLoading } = useBatchImport();

  const isLoading = submitLoading || uploadLoading || searchLoading || batchLoading;

  return {
    handleSubmit,
    handleFileUpload,
    handleKeySearch,
    handleBatchImport,
    isLoading
  };
};
