import useHttp from "../hooks/useHttp";

export type GetUserResponse = {
  downloadable: boolean;
  email: string;
};

const useUserApi = () => {
  const http = useHttp();

  return {
    getUser: () => {
      return http.get<GetUserResponse>("/user");
    },
  };
};

export default useUserApi;
