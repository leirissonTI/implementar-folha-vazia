import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Quando um erro é detectado, apenas defina hasError como true.
    // O objetivo é parar a renderização do componente problemático.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Este é o único lugar onde você quer a informação do erro
    console.error("Erro capturado pela aplicação:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Você pode manter o setState para armazenar o erro no estado
    // se precisar dele para alguma lógica futura, mas para 'apenas logar'
    // não é estritamente necessário mudar o estado para renderizar null.
    // No entanto, é uma boa prática manter o erro no estado para depuração interna ou para um sistema de relatórios.
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Se houver um erro, retorne null. Isso fará com que nada seja renderizado na tela
      // no lugar do componente que falhou. O erro já foi logado no componentDidCatch.
      return null; // Ou <> </> se preferir um fragmento vazio
    }

    // Se não houver erro, renderize os componentes filhos normalmente.
    return this.props.children;
  }
}

export default ErrorBoundary;