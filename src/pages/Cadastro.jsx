import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

export default function Cadastro() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  const cadastrar = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, senha)
      setErro("")
      setSucesso("Conta criada com sucesso! Agora você pode fazer login.")
    } catch (err) {
      console.error("Erro Firebase:", err.code, err.message)
      setErro(`Erro: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Criar conta - entend.me</h1>
      <form onSubmit={cadastrar} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
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
        {sucesso && <p className="text-green-600 mb-2">{sucesso}</p>}
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Criar Conta
        </button>
      </form>
    </div>
  )
}
