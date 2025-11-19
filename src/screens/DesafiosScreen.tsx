import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import desafioService from '../services/desafioService';

export default function DesafiosScreen({ navigation }) {
  const [desafios, setDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [modalProgresso, setModalProgresso] = useState(false);
  const [desafioSelecionado, setDesafioSelecionado] = useState(null);
  const [valorAdicionar, setValorAdicionar] = useState('');

  useEffect(() => {
    carregarDesafios();
  }, [filtroStatus]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDesafios();
    });
    return unsubscribe;
  }, [navigation, filtroStatus]);

  const carregarDesafios = async () => {
    try {
      setLoading(true);
      let data = await desafioService.listarMeusDesafios();
      
      if (filtroStatus !== 'TODOS') {
        data = data.filter(d => d.status === filtroStatus);
      }
      
      setDesafios(data);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os desafios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDesafios();
  };

  const alterarStatusDesafio = async (id, novoStatus) => {
    try {
      const desafio = desafios.find(d => d.id === id);
      if (!desafio) return;

      const dadosAtualizados = {
        ...desafio,
        status: novoStatus,
      };

      await desafioService.atualizar(id, dadosAtualizados);
      
      setDesafios(desafios.map(d => 
        d.id === id ? { ...d, status: novoStatus } : d
      ));
      
      Alert.alert('Sucesso', `Status alterado para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status do desafio');
    }
  };

  const mostrarOpcoesStatus = (id) => {
    Alert.alert(
      'Alterar Status',
      'Escolha o novo status do desafio:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Pendente', onPress: () => alterarStatusDesafio(id, 'PENDENTE') },
        { text: 'Concluído', onPress: () => alterarStatusDesafio(id, 'CONCLUIDO') },
        { text: 'Cancelado', onPress: () => alterarStatusDesafio(id, 'CANCELADO') },
      ]
    );
  };

  const atualizarProgresso = async (id) => {
    const desafio = desafios.find(d => d.id === id);
    if (!desafio) return;

    if (desafio.status === 'CONCLUIDO') {
      Alert.alert('Desafio Concluído', 'Este desafio já foi concluído e não pode mais ser atualizado.');
      return;
    }

    setDesafioSelecionado(desafio);
    setValorAdicionar('');
    setModalProgresso(true);
  };

  const executarAtualizacao = async (valorAdicionar) => {
    if (!desafioSelecionado) return;
    
    if (!valorAdicionar || isNaN(parseFloat(valorAdicionar))) {
      Alert.alert('Erro', 'Digite um valor válido para adicionar');
      return;
    }

    const valorAdicionarNum = parseFloat(valorAdicionar);
    const progressoAtual = desafioSelecionado.progressoAtual || 0;
    const novoProgresso = progressoAtual + valorAdicionarNum;

    try {
      const dadosAtualizados = {
        ...desafioSelecionado,
        progressoAtual: novoProgresso,
      };

      await desafioService.atualizar(desafioSelecionado.id, dadosAtualizados);
      
      setDesafios(desafios.map(d => 
        d.id === desafioSelecionado.id ? { ...d, progressoAtual: novoProgresso } : d
      ));
      
      if (novoProgresso >= desafioSelecionado.objetivoValor) {
        Alert.alert('Parabéns!', 'Desafio concluído automaticamente!');
        setDesafios(desafios.map(d => 
          d.id === desafioSelecionado.id ? { ...d, progressoAtual: novoProgresso, status: 'CONCLUIDO' } : d
        ));
      } else {
        Alert.alert('Sucesso', `Adicionado ${valorAdicionarNum} ${desafioSelecionado.unidade} ao progresso!`);
      }
      
      setModalProgresso(false);
      setDesafioSelecionado(null);
      setValorAdicionar('');
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o progresso: ' + error.message);
    }
  };

  const deletarDesafio = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este desafio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await desafioService.deletar(id);
              setDesafios(desafios.filter(d => d.id !== id));
              Alert.alert('Sucesso', 'Desafio excluído com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o desafio');
            }
          },
        },
      ]
    );
  };

  const formatarData = (data) => {
    if (!data) return 'Sem data';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  };

  const getCorStatus = (status) => {
    switch (status) {
      case 'ATIVO':
        return '#4CAF50';
      case 'CONCLUIDO':
        return '#2196F3';
      case 'CANCELADO':
        return '#FF3B30';
      case 'PENDENTE':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  const renderFiltro = () => (
    <View style={styles.filtrosContainer}>
      {['TODOS', 'CONCLUIDO', 'PENDENTE', 'CANCELADO'].map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filtroButton,
            filtroStatus === status && styles.filtroButtonActive,
          ]}
          onPress={() => setFiltroStatus(status)}
        >
          <Text
            style={[
              styles.filtroButtonText,
              filtroStatus === status && styles.filtroButtonTextActive,
            ]}
          >
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getCorStatus(item.status) }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="trophy" size={24} color={getCorStatus(item.status)} />
          <Text style={styles.cardTitle}>{item.titulo}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              item.status === 'CONCLUIDO' && styles.actionButtonDisabled,
            ]}
            onPress={() => atualizarProgresso(item.id)}
            disabled={item.status === 'CONCLUIDO'}
          >
            <Ionicons 
              name="add-circle" 
              size={20} 
              color={item.status === 'CONCLUIDO' ? '#ccc' : '#4CAF50'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => mostrarOpcoesStatus(item.id)}
          >
            <Ionicons name="swap-horizontal" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deletarDesafio(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, { color: getCorStatus(item.status) }]}>
          {item.status}
        </Text>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {item.progressoAtual || 0} / {item.objetivoValor} {item.unidade}
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(((item.progressoAtual || 0) / item.objetivoValor) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(((item.progressoAtual || 0) / item.objetivoValor) * 100, 100)}%`,
                backgroundColor: item.status === 'CONCLUIDO' ? '#4CAF50' : '#007AFF'
              }
            ]} 
          />
        </View>
      </View>

      {item.descricao && (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descricao}
        </Text>
      )}

      <View style={styles.cardInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="flag-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            Meta: {item.objetivoValor} {item.unidade}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            {formatarData(item.dataInicio)} - {formatarData(item.dataFim)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderFiltro()}
      <FlatList
        data={desafios}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum desafio encontrado</Text>
            <Text style={styles.emptySubtext}>
              Crie um desafio para começar!
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovoDesafio')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal para atualizar progresso */}
      <Modal
        visible={modalProgresso}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalProgresso(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Adicionar ao Progresso
            </Text>
            
            {desafioSelecionado && (
              <>
                <Text style={styles.modalSubtitle}>
                  {desafioSelecionado.titulo}
                </Text>
                <Text style={styles.modalInfo}>
                  Objetivo: {desafioSelecionado.objetivoValor} {desafioSelecionado.unidade}
                </Text>
                <Text style={styles.modalInfo}>
                  Progresso atual: {desafioSelecionado.progressoAtual || 0} {desafioSelecionado.unidade}
                </Text>
                <Text style={styles.modalInfo}>
                  Restam: {(desafioSelecionado.objetivoValor - (desafioSelecionado.progressoAtual || 0)).toFixed(1)} {desafioSelecionado.unidade}
                </Text>
                
                <TextInput
                  style={styles.modalInput}
                  value={valorAdicionar}
                  onChangeText={setValorAdicionar}
                  placeholder={`Quantidade a adicionar (${desafioSelecionado.unidade})`}
                  keyboardType="decimal-pad"
                  autoFocus={true}
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => {
                      setModalProgresso(false);
                      setDesafioSelecionado(null);
                      setValorAdicionar('');
                    }}
                  >
                    <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={() => executarAtualizacao(valorAdicionar)}
                  >
                    <Text style={styles.modalButtonConfirmText}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  filtrosContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtroButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  filtroButtonActive: {
    backgroundColor: '#007AFF',
  },
  filtroButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filtroButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    padding: 8,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardInfo: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    color: '#007AFF',
  },
  modalInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
  },
  modalInput: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalButtonConfirm: {
    backgroundColor: '#007AFF',
  },
  modalButtonCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
