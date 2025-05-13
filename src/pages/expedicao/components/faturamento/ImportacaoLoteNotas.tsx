
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NotaFiscal } from '../../Faturamento';
import { FileText, Trash2 } from 'lucide-react';

interface ImportacaoLoteNotasProps {
  onImportarLote: (notas: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>[]) => void;
}

const ImportacaoLoteNotas: React.FC<ImportacaoLoteNotasProps> = ({ onImportarLote }) => {
  const [notasLote, setNotasLote] = useState<Partial<NotaFiscal>[]>([]);
  
  // Função para adicionar uma linha em branco para preenchimento
  const adicionarLinha = () => {
    setNotasLote([...notasLote, {
      data: new Date(),
      cliente: '',
      remetente: '',
      notaFiscal: '',
      pedido: '',
      dataEmissao: new Date(),
      pesoNota: 0,
      valorNF: 0,
      fretePorTonelada: 0,
      pesoMinimo: 0,
      valorFreteTransferencia: 0,
      cteColeta: '',
      valorColeta: 0,
      cteTransferencia: '',
      paletizacao: 0,
      pedagio: 0,
      aliquotaICMS: 0,
      aliquotaExpresso: 0
    }]);
  };
  
  // Função para atualizar dados de uma nota
  const atualizarNota = (index: number, field: keyof NotaFiscal, value: any) => {
    const novasNotas = [...notasLote];
    novasNotas[index] = { ...novasNotas[index], [field]: value };
    setNotasLote(novasNotas);
  };
  
  // Função para remover uma nota
  const removerNota = (index: number) => {
    const novasNotas = [...notasLote];
    novasNotas.splice(index, 1);
    setNotasLote(novasNotas);
  };
  
  // Função para importar as notas
  const importarNotas = () => {
    // Validar se todos os campos obrigatórios estão preenchidos
    const notasCompletas = notasLote.filter(nota => 
      nota.data && 
      nota.cliente && 
      nota.pesoNota && 
      nota.fretePorTonelada &&
      nota.pesoMinimo !== undefined && 
      nota.aliquotaICMS !== undefined && 
      nota.aliquotaExpresso !== undefined
    ) as Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>[];
    
    if (notasCompletas.length < notasLote.length) {
      alert('Algumas notas possuem campos obrigatórios não preenchidos!');
      return;
    }
    
    onImportarLote(notasCompletas);
    setNotasLote([]); // Limpa o formulário após importar
  };
  
  // Função para importar de CSV
  const importarDeCSV = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const csvText = e.target.value;
      if (!csvText.trim()) return;
      
      const rows = csvText.trim().split('\n');
      if (rows.length <= 1) {
        alert('CSV vazio ou inválido');
        return;
      }
      
      const headers = rows[0].split(';');
      const newNotas: Partial<NotaFiscal>[] = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue;
        
        const values = rows[i].split(';');
        const nota: Partial<NotaFiscal> = {
          data: new Date(),
          cliente: '',
          pesoNota: 0,
          fretePorTonelada: 0,
          pesoMinimo: 0,
          aliquotaICMS: 0,
          aliquotaExpresso: 0
        };
        
        // Mapear valores do CSV para os campos da nota
        headers.forEach((header, index) => {
          if (index < values.length) {
            const value = values[index].trim();
            
            switch (header.trim().toLowerCase()) {
              case 'data':
                const dateParts = value.split('/');
                if (dateParts.length === 3) {
                  nota.data = new Date(
                    parseInt(dateParts[2]), 
                    parseInt(dateParts[1]) - 1, 
                    parseInt(dateParts[0])
                  );
                }
                break;
              case 'cliente':
                nota.cliente = value;
                break;
              case 'remetente':
                nota.remetente = value;
                break;
              case 'nota fiscal':
              case 'notafiscal':
              case 'nota':
                nota.notaFiscal = value;
                break;
              case 'pedido':
                nota.pedido = value;
                break;
              case 'data emissão':
              case 'dataemissao':
                const emissaoParts = value.split('/');
                if (emissaoParts.length === 3) {
                  nota.dataEmissao = new Date(
                    parseInt(emissaoParts[2]), 
                    parseInt(emissaoParts[1]) - 1, 
                    parseInt(emissaoParts[0])
                  );
                }
                break;
              case 'peso':
              case 'peso nota':
              case 'peso bruto':
                nota.pesoNota = parseFloat(value);
                break;
              case 'valor nf':
              case 'valornf':
                nota.valorNF = parseFloat(value);
                break;
              case 'frete por tonelada':
              case 'freteportonelada':
                nota.fretePorTonelada = parseFloat(value);
                break;
              case 'peso mínimo':
              case 'pesomínimo':
              case 'peso minimo':
              case 'pesominimo':
                nota.pesoMinimo = parseFloat(value);
                break;
              case 'valor frete transferencia':
              case 'fretetransferencia':
                nota.valorFreteTransferencia = parseFloat(value);
                break;
              case 'cte coleta':
              case 'ctecoleta':
                nota.cteColeta = value;
                break;
              case 'valor coleta':
              case 'valorcoleta':
                nota.valorColeta = parseFloat(value);
                break;
              case 'cte transferencia':
              case 'ctetransferencia':
                nota.cteTransferencia = value;
                break;
              case 'paletização':
              case 'paletizacao':
                nota.paletizacao = parseFloat(value);
                break;
              case 'pedágio':
              case 'pedagio':
                nota.pedagio = parseFloat(value);
                break;
              case 'alíquota icms':
              case 'aliquota icms':
              case 'aliquotaicms':
              case 'icms':
                nota.aliquotaICMS = parseFloat(value);
                break;
              case 'alíquota expresso':
              case 'aliquota expresso':
              case 'aliquotaexpresso':
              case 'expresso':
                nota.aliquotaExpresso = parseFloat(value);
                break;
            }
          }
        });
        
        newNotas.push(nota);
      }
      
      setNotasLote(newNotas);
    } catch (error) {
      console.error("Erro ao importar CSV:", error);
      alert("Erro ao processar o CSV. Verifique o formato e tente novamente.");
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="csvImport">Importar de CSV (separado por ponto e vírgula)</Label>
            <Textarea 
              id="csvImport" 
              placeholder="Cole aqui seu CSV (cabeçalho na primeira linha)"
              className="h-40 mt-2"
              onChange={importarDeCSV}
            />
            <p className="text-sm text-muted-foreground mt-2">
              O CSV deve conter cabeçalho com nomes das colunas. Ex: Data;Cliente;Peso Nota;Frete por Tonelada;...
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Instruções</h3>
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Separe as colunas com ponto e vírgula (;)</li>
              <li>A primeira linha deve conter os nomes das colunas</li>
              <li>Datas no formato DD/MM/AAAA</li>
              <li>Valores decimais com ponto (.)</li>
              <li>Campos obrigatórios: Data, Cliente, Peso Nota, Frete por Tonelada, Peso Mínimo, Alíquota ICMS e Alíquota Expresso</li>
            </ul>
            <Button className="mt-auto" onClick={adicionarLinha}>
              Adicionar Linha Manualmente
            </Button>
          </div>
        </div>
        
        {notasLote.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                    <TableHead className="whitespace-nowrap">Remetente</TableHead>
                    <TableHead className="whitespace-nowrap">Cliente</TableHead>
                    <TableHead className="whitespace-nowrap">Nota Fiscal</TableHead>
                    <TableHead className="whitespace-nowrap">Pedido</TableHead>
                    <TableHead className="whitespace-nowrap">Peso (kg)</TableHead>
                    <TableHead className="whitespace-nowrap">Valor NF (R$)</TableHead>
                    <TableHead className="whitespace-nowrap">Frete/Ton (R$)</TableHead>
                    <TableHead className="whitespace-nowrap">Peso Mín. (kg)</TableHead>
                    <TableHead className="whitespace-nowrap">Alíq. ICMS (%)</TableHead>
                    <TableHead className="whitespace-nowrap">Alíq. Expresso (%)</TableHead>
                    <TableHead className="whitespace-nowrap">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notasLote.map((nota, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input 
                          type="date" 
                          value={nota.data ? nota.data.toISOString().split('T')[0] : ''}
                          onChange={(e) => atualizarNota(index, 'data', new Date(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={nota.remetente || ''}
                          onChange={(e) => atualizarNota(index, 'remetente', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={nota.cliente || ''}
                          onChange={(e) => atualizarNota(index, 'cliente', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={nota.notaFiscal || ''}
                          onChange={(e) => atualizarNota(index, 'notaFiscal', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={nota.pedido || ''}
                          onChange={(e) => atualizarNota(index, 'pedido', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={nota.pesoNota || 0}
                          onChange={(e) => atualizarNota(index, 'pesoNota', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={nota.valorNF || 0}
                          onChange={(e) => atualizarNota(index, 'valorNF', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={nota.fretePorTonelada || 0}
                          onChange={(e) => atualizarNota(index, 'fretePorTonelada', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={nota.pesoMinimo || 0}
                          onChange={(e) => atualizarNota(index, 'pesoMinimo', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={nota.aliquotaICMS || 0}
                          onChange={(e) => atualizarNota(index, 'aliquotaICMS', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={nota.aliquotaExpresso || 0}
                          onChange={(e) => atualizarNota(index, 'aliquotaExpresso', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removerNota(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setNotasLote([])}>Limpar Tudo</Button>
              <Button onClick={importarNotas}>
                Importar {notasLote.length} {notasLote.length === 1 ? 'Nota' : 'Notas'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportacaoLoteNotas;
