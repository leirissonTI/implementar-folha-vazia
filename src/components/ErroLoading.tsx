




// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ErroLoading({ children }:any) {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
                    {/* Ícone de erro */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Título do erro */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Ocorreu um erro</h2>

                    {/* Mensagem detalhada */}
                    <p className="text-gray-600 mb-4">
                        Não foi possível carregar os dados no momento. Por favor, tente novamente mais tarde.
                    </p>

                    {/* Detalhe do erro (opcional) */}
                    <pre className="text-left text-xs text-red-500 bg-red-50 p-2 rounded overflow-auto max-h-32 mb-4">
                        {children}
                    </pre>

                    {/* Botão de tentar novamente */}
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>

                {/* Rodapé opcional */}
                <p className="mt-6 text-sm text-gray-400">Se o problema persistir, entre em contato com o suporte.</p>
            </div>
        </>
    )
}