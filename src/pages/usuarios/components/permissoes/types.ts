
export type Permission = Record<string, Record<string, Record<string, boolean>>>;

export interface Profile {
  id: string;
  nome: string;
  descricao?: string;
}
