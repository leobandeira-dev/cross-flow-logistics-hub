
import { Usuario } from "@/types/supabase.types";

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  nome: string;
  telefone?: string;
};

export type AuthSession = {
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    expires_at: number;
  };
};
