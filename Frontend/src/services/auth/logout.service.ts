import api from "@/lib/api/axios";
import { AxiosError } from "axios";
import type { ResponseError } from "../types/response.interface";
import useAuthStore from "@/features/auth/store/auth.store";

export default async function logoutUser() {
  try {
    const response = await api.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      },
    );

    useAuthStore.getState().logout();

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ResponseError>;

      // Repasse de mensagem do servidor quando disponível
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }

      if (axiosError.message?.includes("Network Error")) {
        throw new Error(
          "Erro de conexão. Verifique sua internet e tente novamente.",
        );
      }
    }

    throw new Error("Erro ao fazer logout. Tente novamente mais tarde.");
  }
}
