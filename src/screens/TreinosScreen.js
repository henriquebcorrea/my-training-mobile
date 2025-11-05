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
import treinoService from '../services/treinoService';

export default function TreinosScreen({ navigation }) {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarTreinos();
  }, []);

  // Recarregar quando voltar para a tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarTreinos();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarTreinos = async () => {
    try {
      setLoading(true);
      const data = await treinoService.listarMeusTreinos();
      setTreinos(data);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os treinos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarTreinos();
  };

  const deletarTreino = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este treino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await treinoService.deletar(id);
              setTreinos(treinos.filter(t => t.id !== id));
              Alert.alert('Sucesso', 'Treino excluído com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o treino');
            }
          },
        },
      ]
    );
  };

  const formatarData = (dataHora) => {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatarHora = (dataHora) => {
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIconeTipo = (tipo) => {
    switch (tipo) {
      case 'CORRIDA':
        return 'walk';
      case 'CICLISMO':
        return 'bicycle';
      case 'MUSCULACAO':
        return 'barbell';
      default:
        return 'fitness';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('TreinoDetalhes', { treinoId: item.id })}
    >
      <View style={styles.cardIcon}>
        <Ionicons
          name={getIconeTipo(item.tipo)}
          size={28}
          color="#007AFF"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.tipo}</Text>
        <View style={styles.cardInfo}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.cardInfoText}>
            {formatarData(item.dataHora)} às {formatarHora(item.dataHora)}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.cardInfoText}>
            {item.duracaoMin || 0} minutos
          </Text>
        </View>
        {item.distanciaKm && (
          <View style={styles.cardInfo}>
            <Ionicons name="navigate-outline" size={14} color="#666" />
            <Text style={styles.cardInfoText}>
              {item.distanciaKm} km
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deletarTreino(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
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
      <FlatList
        data={treinos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="barbell-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum treino registrado</Text>
            <Text style={styles.emptySubtext}>
              Comece adicionando seu primeiro treino!
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovoTreino')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
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
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  deleteButton: {
    padding: 10,
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
});