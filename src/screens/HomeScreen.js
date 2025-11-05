import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import desafioService from '../services/desafioService';
import treinoService from '../services/treinoService';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [treinos, setTreinos] = useState([]);
  const [desafios, setDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [treinosData, desafiosData] = await Promise.all([
        treinoService.listarMeusTreinos(),
        desafioService.listarMeusDesafios(),
      ]);
      setTreinos(treinosData.slice(0, 5)); 
      setDesafios(desafiosData.filter(d => d.status === 'PENDENTE').slice(0, 3));
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        await logout();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const formatarData = (dataHora) => {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>MyTraining</Text>
            <Text style={styles.headerSubtitle}>
              {user ? `Olá, ${user.nome}!` : 'Bem-vindo de volta!'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Estatísticas rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="fitness" size={24} color="#007AFF" />
          <Text style={styles.statNumber}>{treinos.length}</Text>
          <Text style={styles.statLabel}>Treinos</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{desafios.length}</Text>
          <Text style={styles.statLabel}>Desafios</Text>
        </View>
      </View>

      {/* Últimos Treinos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Treinos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Treinos')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {treinos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="barbell-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum treino registrado</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('NovoTreino')}
            >
              <Text style={styles.addButtonText}>Adicionar Treino</Text>
            </TouchableOpacity>
          </View>
        ) : (
          treinos.map((treino) => (
            <TouchableOpacity
              key={treino.id}
              style={styles.card}
              onPress={() => navigation.navigate('TreinoDetalhes', { treinoId: treino.id })}
            >
              <View style={styles.cardIcon}>
                <Ionicons
                  name={
                    treino.tipo === 'CORRIDA'
                      ? 'walk'
                      : treino.tipo === 'CICLISMO'
                      ? 'bicycle'
                      : 'barbell'
                  }
                  size={24}
                  color="#007AFF"
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{treino.tipo}</Text>
                <Text style={styles.cardSubtitle}>
                  {formatarData(treino.dataHora)} • {treino.duracaoMin || 0} min
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Desafios Ativos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Desafios Ativos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Desafios')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {desafios.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum desafio ativo</Text>
          </View>
        ) : (
          desafios.map((desafio) => (
            <TouchableOpacity
              key={desafio.id}
              style={styles.challengeCard}
            >
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>{desafio.titulo}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{desafio.status}</Text>
                </View>
              </View>
              <Text style={styles.challengeGoal}>
                Meta: {desafio.objetivoValor} {desafio.unidade}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  challengeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  challengeGoal: {
    fontSize: 14,
    color: '#666',
  },
});