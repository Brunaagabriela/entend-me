import { useState, useEffect } from "react"

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

export default function SintomasCheck() {
  const [selecionados, setSelecionados] = useState([])
  const [diagnostico, setDiagnostico] = useState("")

  const toggleSintoma = (label) => {
    setSelecionados(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    )
  }

  useEffect(() => {
    const tipos = {
      tpm: 0,
      mania: 0,
      depressiva: 0
    }

    selecionados.forEach(label => {
      const sintoma = sintomas.find(s => s.label === label)
      if (sintoma) tipos[sintoma.tipo] += 1
    })

    if (tipos.tpm >= 2) {
      setDiagnostico("💡 Pode ser TPM")
    } else if (tipos.mania >= 2) {
      setDiagnostico("⚠️ Pode ser uma fase de euforia (mania)")
    } else if (tipos.depressiva >= 2) {
      setDiagnostico("🫤 Pode ser uma fase depressiva")
    } else {
      setDiagnostico("")
    }
  }, [selecionados])

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Quais sintomas você percebeu hoje?</h2>
      <div className="grid grid-cols-2 gap-2">
        {sintomas.map((s, i) => (
          <button
            key={i}
            className={`p-2 border rounded ${
              selecionados.includes(s.label) ? "bg-blue-200" : "bg-gray-100"
            }`}
            onClick={() => toggleSintoma(s.label)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>

      {diagnostico && (
        <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-900 rounded text-center">
          {diagnostico}
        </div>
      )}
    </div>
  )
}