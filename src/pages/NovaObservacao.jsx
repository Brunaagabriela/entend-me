import { useState, useEffect } from "react"
import { db, auth } from "../firebase"
import { addDoc, collection, Timestamp } from "firebase/firestore"

const sintomas = [
  { label: "Triste", tipo: "tpm" },
  { label: "Chorosa", tipo: "tpm" },
  { label: "Sensível", tipo: "tpm" },
  { label: "Irritada", tipo: "tpm" },
  { label: "Eufórica", tipo: "mania" },
  { label: "Acelerada", tipo: "mania" },
  { label: "Gastando demais", tipo: "mania" },
  { label: "Desanimada", tipo: "depressiva" },
  { label: "Sem apetite", tipo: "depressiva" },
  { label: "Chorando", tipo: "depressiva" }
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Nova percepção</h2>
      <form onSubmit={enviar} className="bg-white p-4 rounded shadow space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {sintomas.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleSintoma(s.label)}
              className={`p-2 border rounded text-sm ${
                selecionados.includes(s.label) ? "bg-blue-300" : "bg-gray-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Descreva o que percebeu hoje"
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={!estado}
        >
          Registrar percepção
        </button>

        {estado && (
          <p className="text-sm text-center text-green-600">
            Detecção: {estado === "tpm" ? "💡 TPM" : estado === "mania" ? "⚠️ Fase de euforia" : "🫤 Fase depressiva"}
          </p>
        )}

        {mensagem && <p className="text-sm text-center">{mensagem}</p>}
      </form>
    </div>
  )
}
