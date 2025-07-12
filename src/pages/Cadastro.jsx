import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

export default function Cadastro() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getMensagemErro = (codigoErro) => {
    switch (codigoErro) {
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso. Tente fazer login."
      case "auth/invalid-email":
        return "O formato do e-mail é inválido."
      case "auth/weak-password":
        return "A senha é muito fraca. Deve ter pelo menos 6 caracteres."
      default:
        return "Ocorreu um erro ao criar a conta. Tente novamente."
    }
  }

  const cadastrar = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setErro("")
    setSucesso("")

    try {
      await createUserWithEmailAndPassword(auth, email, senha)
      setSucesso("Conta criada com sucesso! Redirecionando para o login...")
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err) {
      console.error("Erro Firebase:", err.code, err.message)
      setErro(getMensagemErro(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 relative">
      <div className="absolute inset-0 bg-[url('/background.svg')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-pink-700 mb-6">
          Criar conta - entend.me
        </h1>

        <form onSubmit={cadastrar} className="space-y-5">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          {erro && <p className="text-sm text-red-600 text-center">{erro}</p>}
          {sucesso && (
            <p className="text-sm text-green-600 text-center">{sucesso}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>

          <p className="text-center text-sm text-gray-700">
            Já tem uma conta?{" "}
            <Link to="/" className="text-pink-600 hover:underline font-medium">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
