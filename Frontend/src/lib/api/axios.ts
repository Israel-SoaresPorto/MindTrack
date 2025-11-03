import axios from "axios";
import useAuthStore from "../../features/auth/store/auth.store";

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // URL da API do backend
  timeout: 60000, // 60 segundos de timeout (para geração de PDF)
  withCredentials: true, // Enviar cookies junto com as requisições
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para definir o token de autenticação
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Variável para controlar o estado de refresh token
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Interceptor para adicionar token de autorização se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    // Verifica se o erro é de autenticação (401)
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !(originalRequest.url && originalRequest.url.includes("/auth/refresh"))
    ) {
      console.log("Token expirado, tentando renovar...", originalRequest.url);

      // Se já estiver fazendo refresh, aguarda
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await refreshPromise;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Erro ao aguardar refresh do token:", refreshError);
          return Promise.reject(refreshError);
        }
      }

      // Marca que não deve tentar novamente
      originalRequest._retry = true;

      // Indica que está fazendo refresh
      isRefreshing = true;

      try {
        // Cria nova promessa de refresh apenas se não existir
        if (!refreshPromise) {
          refreshPromise = refreshTokenFunction();
        }

        const newToken = await refreshPromise;

        // Atualiza o token no localStorage
        localStorage.setItem("token", newToken);

        // Atualiza o header da requisição original
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        console.log("Token renovado com sucesso!");

        // Retorna a requisição original com novo token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Falha ao renovar token:", refreshError);

        // Remove token inválido
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];

        // Faz logout
        setTimeout(() => {
          useAuthStore.getState().logout();
        }, 0);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

// Função auxiliar para fazer refresh do token
async function refreshTokenFunction(): Promise<string> {
  try {
    const { data } = await api.post(
      "/auth/refresh",
      {},
      {
        withCredentials: true, // Importante para enviar cookies httpOnly
      }
    );

    const newToken = data.accessToken;

    // Salva o novo token no localStorage
    localStorage.setItem("token", newToken);

    // Atualiza o token no store
    useAuthStore.getState().login(newToken);

    // Atualiza o header padrão do axios
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    return newToken;
  } catch (error) {
    console.error("Erro ao fazer refresh do token:", error);
    // Remove token inválido
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    throw error;
  }
}

export default api;
