import { useState, useEffect } from "react"
import { db, auth } from "../firebase"
import { addDoc, collection, Timestamp } from "firebase/firestore"

const sintomas = [
  { label: "Triste", tipo: "tpm", emoji: "😢" },
  { label: "Chorosa", tipo: "tpm", emoji: "😭" },
  { label: "Sensível", tipo: "tpm", emoji: "🥺" },
  { label: "Irritada", tipo: "tpm", emoji: "😤" },
  { label: "Eufórica", tipo: "mania", emoji: "🤩" },
  { label: "Acelerada", tipo: "mania", emoji: "🏃‍♀️" },
  { label: "Gastando demais", tipo: "mania", emoji: "💸" },
  { label: "Desanimada", tipo: "depressiva", emoji: "😞" },
  { label: "Sem apetite", tipo: "depressiva", emoji: "😕" },
  { label: "Chorando", tipo: "depressiva", emoji: "🥲" }
]

export default function NovaObservacao() {
  const [descricao, setDescricao] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [selecionados, setSelecionados] = useState([])
  const [estado, setEstado] = useState("")

  const toggleSintoma = (label) => {
    setSelecionados((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    )
  }

  useEffect(() => {
    const tipos = { tpm: 0, mania: 0, depressiva: 0 }
    selecionados.forEach((label) => {
      const s = sintomas.find((s) => s.label === label)
      if (s) tipos[s.tipo]++
    })

    if (tipos.tpm >= 2) setEstado("tpm")
    else if (tipos.mania >= 2) setEstado("mania")
    else if (tipos.depressiva >= 2) setEstado("depressiva")
    else setEstado("")
  }, [selecionados])

  const enviar = async (e) => {
    e.preventDefault()
    const user = auth.currentUser
    if (!user) {
      setMensagem("Você precisa estar logado para enviar.")
      return
    }

    try {
      await addDoc(collection(db, "observacoes"), {
        estado,
        sintomas: selecionados,
        descricao,
        criadoEm: Timestamp.now(),
        usuario: user.email
      })
      setDescricao("")
      setSelecionados([])
      setMensagem("Observação registrada com sucesso!")
    } catch (err) {
      setMensagem("Erro ao salvar. Tente novamente.")
    }
  }

  const getCorEstado = (tipo) => {
    switch (tipo) {
      case "tpm":
        return "bg-yellow-200 text-yellow-800 border-yellow-400"
      case "mania":
        return "bg-purple-200 text-purple-800 border-purple-400"
      case "depressiva":
        return "bg-blue-200 text-blue-800 border-blue-400"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 relative px-4">
      <div className="absolute inset-0 opacity-10 bg-[url('/background.svg')] bg-cover bg-center"></div>

      <div className="relative z-10 bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">Nova percepção</h2>

        <form onSubmit={enviar} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {sintomas.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleSintoma(s.label)}
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium shadow transition ${
                  selecionados.includes(s.label)
                    ? "bg-pink-400 text-white"
                    : "bg-white/80 border border-gray-300"
                }`}
              >
                <span className="mr-2">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>

          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Descreva o que percebeu hoje"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg shadow transition disabled:opacity-50"
            disabled={!estado}
          >
            Registrar percepção
          </button>

          {estado && (
            <div className={`mt-4 text-center border-2 rounded-lg py-2 text-md font-semibold ${getCorEstado(estado)}`}>
              Detecção atual:{" "}
              {estado === "tpm"
                ? "💡 TPM identificada"
                : estado === "mania"
                ? "⚠️ Fase de euforia"
                : "🫤 Fase depressiva"}
            </div>
          )}

          {mensagem && <p className="text-sm text-center text-green-600">{mensagem}</p>}
        </form>
      </div>
    </div>
  )
}
  
