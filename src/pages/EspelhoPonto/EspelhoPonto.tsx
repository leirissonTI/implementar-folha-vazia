import { TabelaDePontos } from "../../components/TabelaDePontos"


const EspelhoPonto = () => {
  



  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Espelho de Ponto</h1>
      <p className="font-bold mb-4">Página de visualização dos registros de frequência mensal.</p>
      <TabelaDePontos   />
      <p className="mt-4 text-sm text-gray-500">
        * Os dados exibidos são referentes ao mês atual e podem ser atualizados a qualquer momento.
      </p>
    </div>
  )
}

export default EspelhoPonto 