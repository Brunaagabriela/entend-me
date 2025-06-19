import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    try {
      const resultado = await signInWithEmailAndPassword(auth, email, senha)
      setErro("")

      const usuario = resultado.user
      if (
        usuario.email === "wellington.gonzalez@hotmail.com" ||
        usuario.email === "wellingtoong94@gmail.com"
      ) {
        navigate("/nova-observacao")
      } else {
        navigate("/ops")
      }
    } catch (err) {
      setErro("Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Login - entend.me</h1>
      <form onSubmit={login} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <input
          className="w-full mb-3 p-2 border rounded"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        {erro && <p className="text-red-500 mb-2">{erro}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Entrar
        </button>
      </form>
    </div>
  )
}
