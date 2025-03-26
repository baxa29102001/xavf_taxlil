import { getMe } from "@/api/auth";
import { FC, createContext, useMemo, useState } from "react";
import { useQuery } from "react-query";

const AuthContext = createContext({
  userDetails: null as any | null,
  setUserHandler: (_data: any | null) => {},
});

interface AuthContextProviderTypes {
  children: any;
}

export const AuthContextProvider: FC<AuthContextProviderTypes> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState<any | null>(null);

  const { isLoading } = useQuery(["userDetails"], () => getMe(), {
    staleTime: 1000 * 60 * 5, // 5 daqiqa
    cacheTime: 1000 * 60 * 10, // 10 daqiqa
    onSuccess(data: any) {
      setUserDetails(data);
    },
  });

  // console.log("context rendering");

  const setUserHandler = (data: any | null) => {
    setUserDetails(data);
  };

  const contextValue = useMemo(
    () => ({ userDetails, setUserHandler }),
    [userDetails]
  );
  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading && (
        <div className="flex items-center justify-center text-white h-screen">
          Yuklanmoqda...
        </div>
      )}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
