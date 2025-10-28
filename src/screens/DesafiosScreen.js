import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// MODO MOCK - Trocar para services reais quando backend estiver pronto
import { mockDesafioService as desafioService } from '../services/mockData';

export default function DesafiosScreen({ navigation }) {
  const [desafios, setDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

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
      let data;
      if (filtroStatus === 'TODOS') {
        data = await desafioService.listarTodos();
      } else {
        data = await desafioService.buscarPorStatus(filtroStatus);
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
      {['TODOS', 'ATIVO', 'CONCLUIDO', 'PENDENTE', 'CANCELADO'].map((status) => (
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
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletarDesafio(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, { color: getCorStatus(item.status) }]}>
          {item.status}
        </Text>
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
  deleteButton: {
    padding: 5,
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
});