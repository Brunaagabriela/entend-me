import { useState, useEffect } from "react"
import { db, auth } from "../firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { Link } from "react-router-dom"

// Função auxiliar para formatar o estado com seu respectivo emoji
const formatarEstado = (estado) => {
  switch (estado) {
    case "tpm":
      return "💡 TPM"
    case "mania":
      return "⚠️ Fase de euforia"
    case "depressiva":
      return "🫤 Fase depressiva"
    default:
      return estado
  }
}

export default function Historico() {
  const [historico, setHistorico] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const buscarHistorico = async () => {
      const user = auth.currentUser
      if (!user) {
        setErro("Você precisa estar logado para ver o histórico.")
        setLoading(false)
        return
      }

      try {
        // Cria a query para buscar as observações do usuário logado, ordenadas pela mais recente
        const q = query(
          collection(db, "observacoes"),
          where("usuario", "==", user.email),
          orderBy("criadoEm", "desc")
        )
        const querySnapshot = await getDocs(q)
        const observacoes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setHistorico(observacoes)
      } catch (err) {
        console.error("Erro ao buscar histórico:", err)
        setErro("Não foi possível carregar o histórico. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    buscarHistorico()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-pink-600">Carregando histórico...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{erro}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pink-700">Histórico</h2>
          <Link to="/nova-observacao" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
            + Nova Percepção
          </Link>
        </div>

        {historico.length === 0 ? (
          <div className="text-center bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg">
            <p className="text-gray-600">Nenhuma percepção foi registrada ainda.</p>
            <Link to="/nova-observacao" className="mt-4 inline-block text-pink-600 hover:underline font-medium">
              Comece registrando sua primeira percepção!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {historico.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-lg text-pink-600">{formatarEstado(item.estado)}</span>
                  <span className="text-sm text-gray-500">
                    {/* Adiciona verificação para evitar erro se a data não existir */}
                    {item.criadoEm?.toDate().toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {item.descricao && <p className="text-gray-700 mb-3 italic">"{item.descricao}"</p>}
                <div className="flex flex-wrap gap-2">
                  {/* Adiciona verificação para garantir que 'sintomas' é um array */}
                  {Array.isArray(item.sintomas) && item.sintomas.map((sintoma, index) => (
                    <span key={index} className="bg-pink-200 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {sintoma}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
