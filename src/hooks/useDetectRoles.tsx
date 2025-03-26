import { ROLES } from "@/constants/enum";
import AuthContext from "@/context/authContext";
import { useContext } from "react";

const RolesPermissions = (role: ROLES) => {
  const arr: {
    mainUrl: string;
    role: ROLES;
  }[] = [
    {
      mainUrl: "performer",
      role: ROLES.IJROCHI,
    },
    {
      mainUrl: "masul",
      role: ROLES.MASUL,
    },
    {
      mainUrl: "rahbar",
      role: ROLES.RAHBAR,
    },
  ];

  return arr.find((item) => item.role === role);
};
export const useDetectRoles = (): {
  userDetails: any;
  config: {
    mainUrl: string;
    role: ROLES;
  };
} => {
  const { userDetails } = useContext(AuthContext);
  const config: any = RolesPermissions(userDetails?.role);

  return {
    userDetails,
    config,
  };
};
