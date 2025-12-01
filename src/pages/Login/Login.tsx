import AuthLayout from '../../layouts/AuthLayout'
import LoginForm from './components/LoginForm'
import logoUrl from '../../assets/logo-sjam-branca-horizontal.png'  // Certifique-se de que o caminho está correto
const Login = () => {
    return (
        <AuthLayout>
            <div className="min-h-max   flex  rounded-md shadow-lg shadow-gray-500/50 bg-gray-100">
                <div className="flex-1 flex items-center rounded-l-md justify-center bg-gradient-to-br  bg-blue-400 to-blue-500 p-8">
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-brp-8">
                        <div className="text-center">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="max-w-xs max-h-64 mx-auto mb-4 rounded-lg "
                                />
                            ) : (
                                <div className="w-64 h-64 bg-white bg-opacity-20 rounded-lg  flex items-center justify-center mb-4 backdrop-blur-sm">
                                    <span className="text-white text-6xl font-light">imagem</span>
                                </div>
                            )}

                            <p className="text-white font-semibold text-lg mt-2">Sistema de Ponto Eletrônico</p>
                        </div>
                    </div>
                </div>
                {/* Área do formulário - lado direito */}
                <div className="flex-1  bg-white/55 rounded-r-md  flex items-center justify-center p-8">
                    <LoginForm />
                </div>

            </div>

        </AuthLayout>
    )
}

export default Login 