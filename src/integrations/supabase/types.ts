export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      carregamentos: {
        Row: {
          conferente_id: string | null
          created_at: string
          data_fim_carregamento: string | null
          data_inicio_carregamento: string | null
          id: string
          observacoes: string | null
          ordem_carregamento_id: string | null
          peso_total: number | null
          quantidade_volumes: number
          responsavel_carregamento_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          conferente_id?: string | null
          created_at?: string
          data_fim_carregamento?: string | null
          data_inicio_carregamento?: string | null
          id?: string
          observacoes?: string | null
          ordem_carregamento_id?: string | null
          peso_total?: number | null
          quantidade_volumes: number
          responsavel_carregamento_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          conferente_id?: string | null
          created_at?: string
          data_fim_carregamento?: string | null
          data_inicio_carregamento?: string | null
          id?: string
          observacoes?: string | null
          ordem_carregamento_id?: string | null
          peso_total?: number | null
          quantidade_volumes?: number
          responsavel_carregamento_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carregamentos_conferente_id_fkey"
            columns: ["conferente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carregamentos_ordem_carregamento_id_fkey"
            columns: ["ordem_carregamento_id"]
            isOneToOne: false
            referencedRelation: "ordens_carregamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carregamentos_responsavel_carregamento_id_fkey"
            columns: ["responsavel_carregamento_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      coletas: {
        Row: {
          created_at: string
          data_realizada: string
          id: string
          motorista_id: string | null
          numero_coleta: string
          observacoes: string | null
          peso_total: number | null
          quantidade_volumes: number
          solicitacao_id: string | null
          status: string
          updated_at: string
          veiculo_id: string | null
        }
        Insert: {
          created_at?: string
          data_realizada: string
          id?: string
          motorista_id?: string | null
          numero_coleta: string
          observacoes?: string | null
          peso_total?: number | null
          quantidade_volumes: number
          solicitacao_id?: string | null
          status?: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Update: {
          created_at?: string
          data_realizada?: string
          id?: string
          motorista_id?: string | null
          numero_coleta?: string
          observacoes?: string | null
          peso_total?: number | null
          quantidade_volumes?: number
          solicitacao_id?: string | null
          status?: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coletas_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coletas_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_coleta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coletas_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      comentarios_ocorrencia: {
        Row: {
          comentario: string
          created_at: string
          data_comentario: string
          id: string
          ocorrencia_id: string | null
          usuario_id: string | null
        }
        Insert: {
          comentario: string
          created_at?: string
          data_comentario?: string
          id?: string
          ocorrencia_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          comentario?: string
          created_at?: string
          data_comentario?: string
          id?: string
          ocorrencia_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_ocorrencia_ocorrencia_id_fkey"
            columns: ["ocorrencia_id"]
            isOneToOne: false
            referencedRelation: "ocorrencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_ocorrencia_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          inscricao_estadual: string | null
          logo_url: string | null
          nome_fantasia: string | null
          razao_social: string
          status: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          logo_url?: string | null
          nome_fantasia?: string | null
          razao_social: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          logo_url?: string | null
          nome_fantasia?: string | null
          razao_social?: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enderecamento_caminhao: {
        Row: {
          carregamento_id: string | null
          created_at: string
          etiqueta_id: string | null
          id: string
          ordem: number | null
          posicao: string
        }
        Insert: {
          carregamento_id?: string | null
          created_at?: string
          etiqueta_id?: string | null
          id?: string
          ordem?: number | null
          posicao: string
        }
        Update: {
          carregamento_id?: string | null
          created_at?: string
          etiqueta_id?: string | null
          id?: string
          ordem?: number | null
          posicao?: string
        }
        Relationships: [
          {
            foreignKeyName: "enderecamento_caminhao_carregamento_id_fkey"
            columns: ["carregamento_id"]
            isOneToOne: false
            referencedRelation: "carregamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enderecamento_caminhao_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "etiquetas"
            referencedColumns: ["id"]
          },
        ]
      }
      etiquetas: {
        Row: {
          altura: number | null
          codigo: string
          comprimento: number | null
          created_at: string
          data_geracao: string
          etiqueta_mae_id: string | null
          fragil: boolean | null
          id: string
          largura: number | null
          nota_fiscal_id: string | null
          peso: number | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          altura?: number | null
          codigo: string
          comprimento?: number | null
          created_at?: string
          data_geracao?: string
          etiqueta_mae_id?: string | null
          fragil?: boolean | null
          id?: string
          largura?: number | null
          nota_fiscal_id?: string | null
          peso?: number | null
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          altura?: number | null
          codigo?: string
          comprimento?: number | null
          created_at?: string
          data_geracao?: string
          etiqueta_mae_id?: string | null
          fragil?: boolean | null
          id?: string
          largura?: number | null
          nota_fiscal_id?: string | null
          peso?: number | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "etiquetas_etiqueta_mae_id_fkey"
            columns: ["etiqueta_mae_id"]
            isOneToOne: false
            referencedRelation: "etiquetas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etiquetas_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
        ]
      }
      etiquetas_unitizacao: {
        Row: {
          data_inclusao: string
          etiqueta_id: string
          unitizacao_id: string
        }
        Insert: {
          data_inclusao?: string
          etiqueta_id: string
          unitizacao_id: string
        }
        Update: {
          data_inclusao?: string
          etiqueta_id?: string
          unitizacao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etiquetas_unitizacao_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "etiquetas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etiquetas_unitizacao_unitizacao_id_fkey"
            columns: ["unitizacao_id"]
            isOneToOne: false
            referencedRelation: "unitizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      filiais: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj: string
          created_at: string
          email: string | null
          empresa_id: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          status: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj: string
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filiais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_carregamento: {
        Row: {
          created_at: string
          nota_fiscal_id: string
          ordem_carregamento_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          nota_fiscal_id: string
          ordem_carregamento_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          nota_fiscal_id?: string
          ordem_carregamento_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_carregamento_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_carregamento_ordem_carregamento_id_fkey"
            columns: ["ordem_carregamento_id"]
            isOneToOne: false
            referencedRelation: "ordens_carregamento"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_nota_fiscal: {
        Row: {
          codigo_produto: string
          created_at: string
          descricao: string
          id: string
          nota_fiscal_id: string | null
          quantidade: number
          sequencia: number
          updated_at: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          codigo_produto: string
          created_at?: string
          descricao: string
          id?: string
          nota_fiscal_id?: string | null
          quantidade: number
          sequencia: number
          updated_at?: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          codigo_produto?: string
          created_at?: string
          descricao?: string
          id?: string
          nota_fiscal_id?: string | null
          quantidade?: number
          sequencia?: number
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_nota_fiscal_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
        ]
      }
      localizacoes: {
        Row: {
          area: string | null
          capacidade_peso: number | null
          capacidade_volume: number | null
          codigo: string
          corredor: string | null
          created_at: string
          descricao: string | null
          estante: string | null
          filial_id: string | null
          id: string
          nivel: string | null
          ocupado: boolean | null
          posicao: string | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          capacidade_peso?: number | null
          capacidade_volume?: number | null
          codigo: string
          corredor?: string | null
          created_at?: string
          descricao?: string | null
          estante?: string | null
          filial_id?: string | null
          id?: string
          nivel?: string | null
          ocupado?: boolean | null
          posicao?: string | null
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          capacidade_peso?: number | null
          capacidade_volume?: number | null
          codigo?: string
          corredor?: string | null
          created_at?: string
          descricao?: string | null
          estante?: string | null
          filial_id?: string | null
          id?: string
          nivel?: string | null
          ocupado?: boolean | null
          posicao?: string | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "localizacoes_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
        ]
      }
      modulos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          status: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          status?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          status?: string | null
        }
        Relationships: []
      }
      motoristas: {
        Row: {
          categoria_cnh: string
          cep: string | null
          cidade: string | null
          cnh: string
          cpf: string
          created_at: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          foto_url: string | null
          id: string
          nome: string
          rg: string | null
          status: string | null
          telefone: string | null
          transportadora_id: string | null
          updated_at: string
          validade_cnh: string
        }
        Insert: {
          categoria_cnh: string
          cep?: string | null
          cidade?: string | null
          cnh: string
          cpf: string
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          rg?: string | null
          status?: string | null
          telefone?: string | null
          transportadora_id?: string | null
          updated_at?: string
          validade_cnh: string
        }
        Update: {
          categoria_cnh?: string
          cep?: string | null
          cidade?: string | null
          cnh?: string
          cpf?: string
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          rg?: string | null
          status?: string | null
          telefone?: string | null
          transportadora_id?: string | null
          updated_at?: string
          validade_cnh?: string
        }
        Relationships: [
          {
            foreignKeyName: "motoristas_transportadora_id_fkey"
            columns: ["transportadora_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes: {
        Row: {
          created_at: string
          data_movimentacao: string
          etiqueta_id: string | null
          id: string
          localizacao_destino_id: string | null
          localizacao_origem_id: string | null
          observacoes: string | null
          tipo_movimentacao: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          data_movimentacao?: string
          etiqueta_id?: string | null
          id?: string
          localizacao_destino_id?: string | null
          localizacao_origem_id?: string | null
          observacoes?: string | null
          tipo_movimentacao: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          data_movimentacao?: string
          etiqueta_id?: string | null
          id?: string
          localizacao_destino_id?: string | null
          localizacao_origem_id?: string | null
          observacoes?: string | null
          tipo_movimentacao?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "etiquetas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_localizacao_destino_id_fkey"
            columns: ["localizacao_destino_id"]
            isOneToOne: false
            referencedRelation: "localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_localizacao_origem_id_fkey"
            columns: ["localizacao_origem_id"]
            isOneToOne: false
            referencedRelation: "localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_fiscais: {
        Row: {
          chave_acesso: string | null
          coleta_id: string | null
          created_at: string
          data_emissao: string
          data_entrada: string | null
          data_saida: string | null
          empresa_destinatario_id: string | null
          empresa_emitente_id: string | null
          filial_id: string | null
          id: string
          numero: string
          observacoes: string | null
          ordem_carregamento_id: string | null
          peso_bruto: number | null
          quantidade_volumes: number | null
          serie: string | null
          status: string
          tempo_armazenamento_horas: number | null
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          chave_acesso?: string | null
          coleta_id?: string | null
          created_at?: string
          data_emissao: string
          data_entrada?: string | null
          data_saida?: string | null
          empresa_destinatario_id?: string | null
          empresa_emitente_id?: string | null
          filial_id?: string | null
          id?: string
          numero: string
          observacoes?: string | null
          ordem_carregamento_id?: string | null
          peso_bruto?: number | null
          quantidade_volumes?: number | null
          serie?: string | null
          status?: string
          tempo_armazenamento_horas?: number | null
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          chave_acesso?: string | null
          coleta_id?: string | null
          created_at?: string
          data_emissao?: string
          data_entrada?: string | null
          data_saida?: string | null
          empresa_destinatario_id?: string | null
          empresa_emitente_id?: string | null
          filial_id?: string | null
          id?: string
          numero?: string
          observacoes?: string | null
          ordem_carregamento_id?: string | null
          peso_bruto?: number | null
          quantidade_volumes?: number | null
          serie?: string | null
          status?: string
          tempo_armazenamento_horas?: number | null
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_notas_fiscais_coleta"
            columns: ["coleta_id"]
            isOneToOne: false
            referencedRelation: "coletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notas_fiscais_ordem_carregamento"
            columns: ["ordem_carregamento_id"]
            isOneToOne: false
            referencedRelation: "ordens_carregamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_empresa_destinatario_id_fkey"
            columns: ["empresa_destinatario_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_empresa_emitente_id_fkey"
            columns: ["empresa_emitente_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencias: {
        Row: {
          carregamento_id: string | null
          coleta_id: string | null
          created_at: string
          data_abertura: string
          data_resolucao: string | null
          descricao: string
          empresa_cliente_id: string | null
          etiqueta_id: string | null
          id: string
          nota_fiscal_id: string | null
          prioridade: string
          solucao: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
          usuario_abertura_id: string | null
          usuario_responsavel_id: string | null
        }
        Insert: {
          carregamento_id?: string | null
          coleta_id?: string | null
          created_at?: string
          data_abertura?: string
          data_resolucao?: string | null
          descricao: string
          empresa_cliente_id?: string | null
          etiqueta_id?: string | null
          id?: string
          nota_fiscal_id?: string | null
          prioridade: string
          solucao?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
          usuario_abertura_id?: string | null
          usuario_responsavel_id?: string | null
        }
        Update: {
          carregamento_id?: string | null
          coleta_id?: string | null
          created_at?: string
          data_abertura?: string
          data_resolucao?: string | null
          descricao?: string
          empresa_cliente_id?: string | null
          etiqueta_id?: string | null
          id?: string
          nota_fiscal_id?: string | null
          prioridade?: string
          solucao?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          usuario_abertura_id?: string | null
          usuario_responsavel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_carregamento_id_fkey"
            columns: ["carregamento_id"]
            isOneToOne: false
            referencedRelation: "carregamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_coleta_id_fkey"
            columns: ["coleta_id"]
            isOneToOne: false
            referencedRelation: "coletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_empresa_cliente_id_fkey"
            columns: ["empresa_cliente_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "etiquetas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_usuario_abertura_id_fkey"
            columns: ["usuario_abertura_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_usuario_responsavel_id_fkey"
            columns: ["usuario_responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_carregamento: {
        Row: {
          created_at: string
          data_criacao: string
          data_finalizacao: string | null
          data_inicio: string | null
          data_programada: string | null
          empresa_cliente_id: string | null
          filial_id: string | null
          id: string
          motorista_id: string | null
          numero_ordem: string
          observacoes: string | null
          status: string
          tipo_carregamento: string
          updated_at: string
          veiculo_id: string | null
        }
        Insert: {
          created_at?: string
          data_criacao?: string
          data_finalizacao?: string | null
          data_inicio?: string | null
          data_programada?: string | null
          empresa_cliente_id?: string | null
          filial_id?: string | null
          id?: string
          motorista_id?: string | null
          numero_ordem: string
          observacoes?: string | null
          status?: string
          tipo_carregamento: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Update: {
          created_at?: string
          data_criacao?: string
          data_finalizacao?: string | null
          data_inicio?: string | null
          data_programada?: string | null
          empresa_cliente_id?: string | null
          filial_id?: string | null
          id?: string
          motorista_id?: string | null
          numero_ordem?: string
          observacoes?: string | null
          status?: string
          tipo_carregamento?: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_carregamento_empresa_cliente_id_fkey"
            columns: ["empresa_cliente_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_carregamento_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_carregamento_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_carregamento_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil_permissoes: {
        Row: {
          created_at: string
          modulo_id: string
          perfil_id: string
          permitido: boolean | null
          rotina_id: string
          tabela_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          modulo_id: string
          perfil_id: string
          permitido?: boolean | null
          rotina_id: string
          tabela_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          modulo_id?: string
          perfil_id?: string
          permitido?: boolean | null
          rotina_id?: string
          tabela_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_permissoes_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_permissoes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_permissoes_rotina_id_fkey"
            columns: ["rotina_id"]
            isOneToOne: false
            referencedRelation: "rotinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_permissoes_tabela_id_fkey"
            columns: ["tabela_id"]
            isOneToOne: false
            referencedRelation: "tabelas"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          permissoes: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          permissoes?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          permissoes?: Json
          updated_at?: string
        }
        Relationships: []
      }
      rotinas: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          status: string | null
          tabela_id: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          status?: string | null
          tabela_id?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          status?: string | null
          tabela_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rotinas_tabela_id_fkey"
            columns: ["tabela_id"]
            isOneToOne: false
            referencedRelation: "tabelas"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_coleta: {
        Row: {
          cep_coleta: string | null
          cidade_coleta: string | null
          contato_nome: string | null
          contato_telefone: string | null
          created_at: string
          data_aprovacao: string | null
          data_coleta: string | null
          data_solicitacao: string
          empresa_solicitante_id: string | null
          endereco_coleta: string | null
          estado_coleta: string | null
          id: string
          numero_solicitacao: string
          observacoes: string | null
          status: string
          tempo_aprovacao_coleta_horas: number | null
          tipo_coleta: string
          updated_at: string
        }
        Insert: {
          cep_coleta?: string | null
          cidade_coleta?: string | null
          contato_nome?: string | null
          contato_telefone?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_coleta?: string | null
          data_solicitacao?: string
          empresa_solicitante_id?: string | null
          endereco_coleta?: string | null
          estado_coleta?: string | null
          id?: string
          numero_solicitacao: string
          observacoes?: string | null
          status?: string
          tempo_aprovacao_coleta_horas?: number | null
          tipo_coleta: string
          updated_at?: string
        }
        Update: {
          cep_coleta?: string | null
          cidade_coleta?: string | null
          contato_nome?: string | null
          contato_telefone?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_coleta?: string | null
          data_solicitacao?: string
          empresa_solicitante_id?: string | null
          endereco_coleta?: string | null
          estado_coleta?: string | null
          id?: string
          numero_solicitacao?: string
          observacoes?: string | null
          status?: string
          tempo_aprovacao_coleta_horas?: number | null
          tipo_coleta?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_coleta_empresa_solicitante_id_fkey"
            columns: ["empresa_solicitante_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      tabelas: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          modulo_id: string | null
          nome: string
          status: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          modulo_id?: string | null
          nome: string
          status?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          modulo_id?: string | null
          nome?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tabelas_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      unitizacoes: {
        Row: {
          codigo: string
          created_at: string
          data_unitizacao: string
          id: string
          localizacao_id: string | null
          status: string
          tipo_unitizacao: string
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          codigo: string
          created_at?: string
          data_unitizacao?: string
          id?: string
          localizacao_id?: string | null
          status?: string
          tipo_unitizacao: string
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string
          data_unitizacao?: string
          id?: string
          localizacao_id?: string | null
          status?: string
          tipo_unitizacao?: string
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unitizacoes_localizacao_id_fkey"
            columns: ["localizacao_id"]
            isOneToOne: false
            referencedRelation: "localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unitizacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          empresa_id: string | null
          id: string
          nome: string
          perfil_id: string | null
          status: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          empresa_id?: string | null
          id: string
          nome: string
          perfil_id?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          perfil_id?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos: {
        Row: {
          ano: number | null
          capacidade_peso: number | null
          capacidade_volume: number | null
          created_at: string
          id: string
          marca: string | null
          modelo: string | null
          placa: string
          status: string | null
          tipo: string
          transportadora_id: string | null
          updated_at: string
        }
        Insert: {
          ano?: number | null
          capacidade_peso?: number | null
          capacidade_volume?: number | null
          created_at?: string
          id?: string
          marca?: string | null
          modelo?: string | null
          placa: string
          status?: string | null
          tipo: string
          transportadora_id?: string | null
          updated_at?: string
        }
        Update: {
          ano?: number | null
          capacidade_peso?: number | null
          capacidade_volume?: number | null
          created_at?: string
          id?: string
          marca?: string | null
          modelo?: string | null
          placa?: string
          status?: string | null
          tipo?: string
          transportadora_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_transportadora_id_fkey"
            columns: ["transportadora_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
