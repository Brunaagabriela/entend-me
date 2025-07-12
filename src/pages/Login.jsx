import { useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import macacoAnimacao from "../assets/macaco.json"; // Certifique-se de que este caminho está correto
import logo from "../assets/Logoentend.me.png"; // Certifique-se de que este caminho está correto

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const lottieRef = useRef();

  // ESTA LINHA DEVE ESTAR DESCOMENTADA E CORRETA!
  const [campoFocado, setCampoFocado] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErro("");

    try {
      const resultado = await signInWithEmailAndPassword(auth, email, senha);
      const usuario = resultado.user;

      // Agora, qualquer usuário que fizer login com sucesso será redirecionado.
      navigate("/nova-observacao");
    } catch (err) {
      setErro("Erro ao fazer login. Verifique suas credenciais.");
      // Opcional: Adicionar mais detalhes do erro para depuração, se necessário
      console.error("Erro de login:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o desfoque de ambos os campos
  const handleBlur = () => {
    setCampoFocado(null); // Reseta o estado do campo focado
    // Animação para o estado "neutro/sorridente"
    // Os segmentos [40, 60] são um exemplo. Certifique-se de que correspondem à sua animação Lottie.
    lottieRef.current?.playSegments([0, 20], true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 relative overflow-hidden">
      {/* Fundo gradiente com blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-200 to-purple-300 filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-teal-100 to-blue-200 filter blur-3xl opacity-70"></div>
      </div>

      {/* Card de login */}
      <div className="relative z-10 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center">
        {/* Macaco animado */}
        <div className="mb-6 bg-pink-300 p-4 rounded-full flex items-center justify-center shadow-md">
          <Lottie
            animationData={macacoAnimacao}
            lottieRef={lottieRef}
            autoplay={false} // Não inicia automaticamente
            loop={false} // Não repete automaticamente
            className="w-24 h-24"
            // Opcional: Adicionar um `onDOMLoaded` ou `onComplete` para garantir que a animação esteja pronta para ser controlada
            // Ou garantir que a primeira animação neutra seja acionada ao carregar o componente
            onDOMLoaded={() => lottieRef.current?.playSegments([0, 20], true)}
          />
        </div>

        {/* Formulário */}
        <form onSubmit={login} className="w-full space-y-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.5v2.5a2.5 2.5 0 01-5 0v-2.5"
                />
              </svg>
            </span>
            <input
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white bg-opacity-80"
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => {
                setCampoFocado("email");
                // Animação para "espiar"
                // Os segmentos [80, 100] são um exemplo. Ajuste conforme sua animação.
                lottieRef.current?.playSegments([80, 100], true);
              }}
              onBlur={handleBlur} // Chama a função genérica de desfoque
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"
                />
              </svg>
            </span>
            <input
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white bg-opacity-80"
              type="password"
              placeholder="*********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => {
                setCampoFocado("senha");
                // Animação para "tampar os olhos"
                // Os segmentos [0, 20] são um exemplo. Ajuste conforme sua animação.
                lottieRef.current?.playSegments([40, 60], true);
              }}
              onBlur={handleBlur} // Chama a função genérica de desfoque
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 accent-pink-400" />
              Remember me
            </label>
            <a href="#" className="text-pink-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 pt-4">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="font-medium text-pink-600 hover:underline">
            Cadastre-se
          </Link>
        </p>

        {/* Logo no canto inferior direito */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-60">
          <span className="font-semibold text-gray-700 text-md">
          </span>
        </div>
      </div>
    </div>
  );
}