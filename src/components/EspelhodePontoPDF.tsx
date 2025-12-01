// import { imagemBase64PretoEBranco } from "../assets/imagemBase64PretoBranco";
import { imagemBase64PretoEBranco } from '../assets/imagemBase64PretoBranco';
import type { RegistroPonto } from '../types/RegistroPonto';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

interface UserData {
  cargo: string | null;
  cpf: string | null;
  matricula: string | null;
  nome: string | null;
  setor: string | null;
  setorSigla: string | null;
}

interface EspelhoPontoPdfProps {
  data: RegistroPonto[];
  dataUser: UserData;
}



const styles = StyleSheet.create({
  page: {
    padding: 30,
    flexDirection: 'column',
    fontSize: 8,
  },

  // Cabeçalho principal
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },

  logo: {
    width: 100,
    height: 50,
  },

  institutionName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 20,
  },

  dateContainer: {
    alignItems: 'flex-end',
  },

  date: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Dados do usuário
  userDataContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },

  userDataRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },

  userDataLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: 80,
  },

  userDataValue: {
    fontSize: 9,
    flex: 1,
  },

  // Tabela
  table: {
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },

  tableRow: {
    flexDirection: 'row',
  },

  tableHeaderCell: {
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 2,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 18,
  },

  tableDataCell: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 2,
    textAlign: 'center',
    fontSize: 9,
    minHeight: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Larguras específicas das colunas
  colDia: { width: ' 10%' },
  colHorario: { width: '10%' },
  colTempo: { width: ' 10%' },
  colStatus: { width: '10%' },

  // Estilos para status
  statusText: {
    fontSize: 7,
  },

  statusAusente: {
    color: 'red',
    fontWeight: 'bold',
  },

  statusPresente: {
    color: 'green',
  },

  // Legenda
  legend: {
    marginTop: 15,
    fontSize: 7,
    textAlign: 'left',
    textColor: '#646464'
  },

  // Fundo cinza claro para fins de semana
  weekendBackground: {
    backgroundColor: '#e0e0e0',
  },

})

export function EspelhoPontoPdf({ data = [], dataUser = {
  cargo: null,
  cpf: null,
  matricula: null,
  nome: null,
  setor: null,
  setorSigla: null
} }: EspelhoPontoPdfProps) {


  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Cabeçalho Principal */}
        <View style={styles.mainHeader}>

          <Image style={styles.logo} src={imagemBase64PretoEBranco} />

          <Text style={styles.institutionName}>
            Justiça Federal - Seção Judiciária do Amazonas
          </Text>

          <View style={styles.dateContainer}>
            <Text style={styles.date}>DATA: {formatDate()}</Text>
          </View>
        </View>

        {/* Dados do Usuário */}
        <View style={styles.userDataContainer}>
          <View style={styles.userDataRow}>
            <Text style={styles.userDataLabel}>NOME:</Text>
            <Text style={styles.userDataValue}>{dataUser.nome}</Text>
          </View>

          <View style={styles.userDataRow}>
            <Text style={styles.userDataLabel}>CPF:</Text>
            <Text style={styles.userDataValue}>{dataUser.cpf}</Text>
          </View>
          <View style={styles.userDataRow}>
            <Text style={styles.userDataLabel}>MATRÍCULA:</Text>
            <Text style={styles.userDataValue}>{dataUser.matricula}</Text>
          </View>

          <View style={styles.userDataRow}>
            <Text style={styles.userDataLabel}>CARGO:</Text>
            <Text style={styles.userDataValue}>{dataUser.cargo}</Text>
          </View>

          <View style={styles.userDataRow}>
            <Text style={styles.userDataLabel}>SETOR:</Text>
            <Text style={styles.userDataValue}>{dataUser.setor} - ({dataUser.setorSigla})</Text>
          </View>

          <View style={styles.userDataRow}>
            <Text style={styles.legend}>Sistema PONTOJUS - Relatório Mensal de Frequência</Text>
          </View>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
          {/* Cabeçalho */}
          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, styles.colDia]}>
              <Text>DIA</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colHorario]}>
              <Text>1ª ENTRADA</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colHorario]}>
              <Text>1ª SAÍDA</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colHorario]}>
              <Text>2ª ENTRADA</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colHorario]}>
              <Text>2ª SAÍDA</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colTempo]}>
              <Text>CRÉDITO</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colTempo]}>
              <Text>DÉBITO</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colTempo]}>
              <Text>NORMAIS</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colTempo]}>
              <Text>EXTRAS</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colTempo]}>
              <Text>TRABALHADAS</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colTempo]}>
              <Text>SALDO</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.colStatus, { borderRightWidth: 0 }]}>
              <Text>STATUS</Text>
            </View>
          </View>

          {/* Linhas de Dados */}
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableDataCell, styles.colDia]}>
                <Text>{item.diaDoMes}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colHorario]}>
                <Text>{item.primeiraEntrada || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colHorario]}>
                <Text>{item.primeiraSaida || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colHorario]}>
                <Text>{item.segundaEntrada || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colHorario]}>
                <Text>{item.segundaSaida || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colTempo]}>
                <Text>{item.credito || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colTempo]}>
                <Text>{item.debito || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colTempo]}>
                <Text>{item.horasNormais || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colTempo]}>
                <Text>{item.horasExtras || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colTempo]}>
                <Text>{item.horasTrabalhadas || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colTempo]}>
                <Text>{item.saldo || '-'}</Text>
              </View>
              <View style={[styles.tableDataCell, styles.colStatus, { borderRightWidth: 0 }]}>
                {/* <Text style={{ color: item.status === 'Ausente' ? 'red' : 'black' }}> */}
                <Text style={{ color: item.status === 'Sem Registro' ? 'red' : 'black' }}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}