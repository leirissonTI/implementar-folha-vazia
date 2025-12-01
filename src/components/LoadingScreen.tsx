
export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Spinner circular
      indigo-200
      */}
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>

      {/* Texto */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Carregando dados...</h2>
      <p className="text-sm text-gray-500">Estamos preparando seu conteúdo. Aguarde um momento.</p>

      {/* Barra de progresso simulada */}
      <div className="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="animate-progress h-full bg-blue-600"></div>
      </div>
    </div>
  )
}

