import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import apiClient from '../../../service/apiClient'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


// Schema atualizado com "matricula"
const loginSchema = zod.object({
    username: zod.string().min(6, 'Matrícula inválida. Ex: AM618PS'),
    password: zod.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type FormData = zod.infer<typeof loginSchema>

const LoginForm = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    })

    const { login } = useAuth()

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setError(null)

        try {
            const response = await apiClient.post('/login', {
                username: data.username.toUpperCase(),
                password: data.password,
            })

            // Verificando resposta do backend
            if (response.data && response.data.token) {
                const token = response.data.token
                login(token, data.username.toUpperCase())  // Função que gerencia o login (salva no contexto/localStorage)
                toast.success('Login realizado com sucesso!', {
                    position: 'top-right',
                    autoClose: 1000,
                    onClose: () => {
                        window.location.href = '/'  // Redireciona após fechar o toast
                    },
                })
            } else {
                toast.error('Matrícula ou senha inválidos.', {
                    position: 'top-right',
                    autoClose: 1000,
                })
            }

        } catch (error: unknown) {
            // Tratamento de erro
            if (error instanceof Error) {
                toast.error('Matrícula ou senha inválidos.', {
                    position: 'top-right',
                    autoClose: 1000,
                })
            }
            setError('Ocorreu um erro ao tentar fazer login. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Acesso ao Sistema</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <Input
                label="Matrícula"
                {...register('username')}
                error={errors.username?.message}
                placeholder="ex: AM618PS"
            />

            <Input
                label="Senha"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder='*********'
            />

            <Button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
            </Button>
        </form>
    )
}

export default LoginForm 