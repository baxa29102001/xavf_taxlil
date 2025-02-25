import { ROLES } from "@/constants/enum";
import AuthContext from "@/context/authContext";
import { useContext } from "react";

const RolesPermissions = (role: ROLES) => {
  const arr = [
    {
      mainUrl: "performer",
      role: ROLES.IJROCHI,
    },
    {
      mainUrl: "masul",
      role: ROLES.MASUL,
    },
  ];

  return arr.find((item) => item.role === role);
};
export const useDetectRoles = () => {
  const { userDetails } = useContext(AuthContext);
  const config: any = RolesPermissions(userDetails?.role);

  return {
    userDetails,
    config,
  };
};
