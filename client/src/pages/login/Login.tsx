import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "@api/auth.api";
import type { LoginData } from "@utils/LoginUtils";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const loginData: LoginData = {
        correo: email,
        contrasena: password,
      };

      const response = await loginRequest(loginData);

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirigir según el rol del usuario
      if (response.user.rol === "cajero") {
        navigate("/dashboard/empleado");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error en login:", err);

      const errorMessage = "Usuario o contraseña incorrectos";

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Cargar email guardado si existe
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedRememberMe = localStorage.getItem("rememberMe");

    if (savedEmail && savedRememberMe === "true") {
      setEmail(savedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-dark via-card to-primary p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-button/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Card de Login */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-primary to-card p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-black text-primary">D</span>
            </div>
            <h1 className="text-3xl font-display font-black text-white mb-2">
              DrinKéo POS
            </h1>
            <p className="text-white/80 text-sm">Sistema de Punto de Venta</p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            {/* Mensaje de error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 animate-fade-in">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-red-700 text-sm flex-1">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-700 transition-colors shrink-0 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    className="w-full pl-11 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
                    disabled={isLoading}
                  >
                    {!showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de Login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-button to-button-hover text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2025 DrinKéo POS. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
