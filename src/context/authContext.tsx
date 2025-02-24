import { getMe } from "@/api/auth";
import { FC, createContext, useState } from "react";
import { useQuery } from "react-query";

const AuthContext = createContext({
  userDetails: null as any | null,
  step: Number(localStorage.getItem("step")) || 1,
  setUserHandler: (_data: any | null) => {},
  setStepHandler: (_data: number) => {},
});

interface AuthContextProviderTypes {
  children: any;
}

export const AuthContextProvider: FC<AuthContextProviderTypes> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [step, setStep] = useState(Number(localStorage.getItem("step")) || 1);

  const { isLoading } = useQuery("userDetails", () => getMe(), {
    onSuccess(data: any) {
      setUserDetails(data);
    },
  });

  const setUserHandler = (data: any | null) => {
    setUserDetails(data);
  };

  const setStepHandler = (data: number) => {
    setStep(data);
    localStorage.setItem("step", data.toString());
  };

  return (
    <AuthContext.Provider
      value={{ userDetails, setUserHandler, step, setStepHandler }}
    >
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
