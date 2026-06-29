import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { IoPersonOutline, IoLockClosedOutline } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";
import { useToastContext } from "../../context/ToastContext";
import { ROUTES } from "../../constants/routes";
import { COMPANY } from "../../constants/company";
import Button from "../../components/ui/Button";
import CompanyLogo from "../../components/ui/CompanyLogo";

const LoginPage = () => {
  const { login, loading, isAuthenticated } = useAuthContext();
  const { addToast } = useToastContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
  });

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const onSubmit = async (data) => {
    const result = await login(data.username, data.password);
    if (result.success) {
      addToast("Login successful! Welcome back.", "success");
      navigate(ROUTES.DASHBOARD);
    } else {
      addToast(result.message || "Login failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-[#0f2d6e] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CompanyLogo
                variant="icon"
                className="w-35 h-35 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary">{COMPANY.name}</h1>
            <p className="text-text-secondary text-sm mt-1">
              {COMPANY.appSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-primary block mb-1">
                Username
              </label>
              <div className="relative">
                <IoPersonOutline
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  size={18}
                />
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter username"
                />
              </div>
              {errors.username && (
                <span className="text-xs text-danger mt-1">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-primary block mb-1">
                Password
              </label>
              <div className="relative">
                <IoLockClosedOutline
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  size={18}
                />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-2.5 text-sm border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-danger mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
