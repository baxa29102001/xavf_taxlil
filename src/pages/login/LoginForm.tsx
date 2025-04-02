import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { getMe, login } from "@/api/auth";
import AuthContext from "@/context/authContext";
import { useNavigate } from "react-router-dom";

const schema = object().shape({
  username: string().required("Majburiy maydon"),
  password: string()
    .min(2, "Parol kamida 2 donadan ibora bo'lishi kerak")
    .required("Parol to'ldirilishi shart"),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(false);

  const userdetails = useContext(AuthContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const error_form: any = errors;

  const submitHandler = async (data: any) => {
    setLoading(true);
    try {
      await login(data);
      const user = await getMe();
      userdetails.setUserHandler(user);
    } catch (error) {
      //   toast.error("Username, parolda xatolik yoki bunday user mavjud emas");
    } finally {
      setLoading(false);
    }
  };

  const backHandler = () => {
    localStorage?.clear();
    userdetails.setUserHandler(null);

    navigate("/general");
  };

  return (
    <>
      <div className="flex items-center">
        <div className="bg-[#1C5196] px-[62px] py-[81px] h-screen">
          <div className="flex flex-col justify-between items-center">
            <h2 className="text-[32px] text-white text-center w-[525px] mb-20 Monstreat">
              “OʻZKOMNAZORAT” INSPEKSIYASI
            </h2>
            <div className="flex items-end  justify-center mb-30">
              <img src={"/logo.svg"} alt="" className="w-[400px] h-[500px]" />
            </div>

            <p className="text-white font-medium">
              Axborot tizimi{" "}
              <span className="text-lg font-bold text-[#45A57D]">
                <a href="http://technocorp.uz/">Technocorp</a>
              </span>{" "}
              tomonidan ishlab chiqilgan
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <form
            autoComplete="off"
            className="w-[451px]"
            onSubmit={handleSubmit(submitHandler)}
          >
            <h2 className="Monstreat  text-[30px] text-center mb-12">
              Tizimga kirish
            </h2>
            <div className="mb-[30px]">
              <label
                htmlFor="login"
                className="block text-[#828282] font-medium mb-3"
              >
                Login
              </label>
              <input
                autoComplete="off"
                type="text"
                id="username"
                placeholder="Login"
                className="p-5 outline-none mb-1 bg-black/50 text-white rounded w-full"
                {...register("username")}
              />
              {error_form?.username?.message && (
                <p className="text-qizil-main ">
                  {error_form?.username?.message}
                </p>
              )}
            </div>
            <div className="mb-[30px] relative">
              <label
                htmlFor="password"
                className="block text-[#828282] font-medium mb-3"
              >
                Parol
              </label>
              <input
                autoComplete="off"
                type={type ? "text" : "password"}
                id="Parol"
                placeholder="Parol"
                className="p-5 outline-none mb-1 bg-black/50 text-white rounded w-full pr-14"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setType((p) => !p)}
                className="absolute top-[18%] right-2 translate-y-[35%] px-3 py-5 cursor-pointer"
              >
                {/* <EyeIcon /> */}
                korish
              </button>
              {error_form?.password?.message && (
                <p className="text-qizil-main ">
                  {error_form?.password?.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-400 cursor-pointer py-5 text-white text-lg  font-medium"
              disabled={loading}
            >
              <div className="flex items-center justify-center">
                {loading ? "Loading..." : "Kirish"}
              </div>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
