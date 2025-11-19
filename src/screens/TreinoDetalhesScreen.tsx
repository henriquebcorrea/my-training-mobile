import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import exercicioService from '../services/exercicioService';
import treinoService from '../services/treinoService';

export default function TreinoDetalhesScreen({ navigation, route }) {
  const { treinoId } = route.params;
  const { user } = useContext(AuthContext);
  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adicionandoExercicio, setAdicionandoExercicio] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [cargaKg, setCargaKg] = useState('');
  const [observacoesExercicio, setObservacoesExercicio] = useState('');

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
      const treinoData = await treinoService.buscarPorId(treinoId);
      setTreino(treinoData);

      try {
        const ownerId = treinoData?.usuarioId ?? null;
        if (ownerId !== null && user && ownerId !== user.id) {
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      } catch (e) {
        setHasAccess(false);
      }

      try {
        const exerciciosData = await exercicioService.listarPorTreino(treinoId);
        setExercicios(exerciciosData);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setExercicios([]);
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do treino');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const adicionarExercicio = async () => {
    if (!hasAccess) {
      Alert.alert('Acesso negado', 'Você não tem permissão para adicionar exercícios neste treino');
      return;
    }
    if (!nomeExercicio.trim() || !series || !repeticoes) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setAdicionandoExercicio(true);
      
      const dadosExercicio = {
        nome: nomeExercicio.trim(),
        series: parseInt(series),
        repeticoes: parseInt(repeticoes),
        cargaKg: cargaKg ? parseFloat(cargaKg) : null,
        observacoes: observacoesExercicio.trim() || null,
        treinoId: treinoId,
      };

      await exercicioService.criar(dadosExercicio);
      
      setNomeExercicio('');
      setSeries('');
      setRepeticoes('');
      setCargaKg('');
      setObservacoesExercicio('');
      
      await carregarDados();
      
      Alert.alert('Sucesso', 'Exercício adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o exercício');
    } finally {
      setAdicionandoExercicio(false);
    }
  };

  const deletarExercicio = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este exercício?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await exercicioService.deletar(id);
              setExercicios(exercicios.filter(e => e.id !== id));
              Alert.alert('Sucesso', 'Exercício excluído com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o exercício');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderExercicio = ({ item }) => (
    <View style={styles.exercicioCard}>
      <View style={styles.exercicioHeader}>
        <Text style={styles.exercicioNome}>{item.nome}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletarExercicio(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.exercicioInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="repeat" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.series} séries x {item.repeticoes} reps
          </Text>
        </View>
        
        {item.cargaKg && (
          <View style={styles.infoItem}>
            <Ionicons name="barbell" size={16} color="#666" />
            <Text style={styles.infoText}>
              {item.cargaKg} kg
            </Text>
          </View>
        )}
        
        {item.observacoes && (
          <View style={styles.infoItem}>
            <Ionicons name="document-text" size={16} color="#666" />
            <Text style={styles.infoText}>
              {item.observacoes}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderFormularioExercicio = () => {
    if (treino?.tipo !== 'MUSCULACAO') {
      return (
        <View style={styles.formularioContainer}>
          <Text style={styles.formularioTitulo}>Exercícios</Text>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
            <Text style={styles.infoCardText}>
              Exercícios só podem ser adicionados para treinos de musculação.
            </Text>
          </View>
        </View>
      );
    }

    if (!hasAccess) {
      return (
        <View style={styles.formularioContainer}>
          <Text style={styles.formularioTitulo}>Exercícios</Text>
          <View style={styles.infoCard}>
            <Ionicons name="lock-closed" size={24} color="#FF3B30" />
            <Text style={styles.infoCardText}>
              Você não tem permissão para adicionar ou visualizar exercícios deste treino.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.formularioContainer}>
        <Text style={styles.formularioTitulo}>Adicionar Exercício</Text>
        
        <TextInput
          style={styles.input}
          value={nomeExercicio}
          onChangeText={setNomeExercicio}
          placeholder="Nome do exercício *"
        />
        
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            value={series}
            onChangeText={setSeries}
            placeholder="Séries *"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.inputHalf]}
            value={repeticoes}
            onChangeText={setRepeticoes}
            placeholder="Repetições *"
            keyboardType="numeric"
          />
        </View>
        
        <TextInput
          style={styles.input}
          value={cargaKg}
          onChangeText={setCargaKg}
          placeholder="Carga (kg)"
          keyboardType="decimal-pad"
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observacoesExercicio}
          onChangeText={setObservacoesExercicio}
          placeholder="Observações"
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity
          style={styles.adicionarButton}
          onPress={adicionarExercicio}
          disabled={adicionandoExercicio}
        >
          {adicionandoExercicio ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.adicionarButtonText}>Adicionar Exercício</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!treino) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Treino não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.treinoHeader}>
        <View style={styles.treinoInfo}>
          <Text style={styles.treinoTipo}>{treino.tipo}</Text>
          <Text style={styles.treinoData}>{formatarData(treino.dataHora)}</Text>
          <Text style={styles.treinoDuracao}>{treino.duracaoMin} minutos</Text>
          {treino.distanciaKm && (
            <Text style={styles.treinoDistancia}>{treino.distanciaKm} km</Text>
          )}
        </View>
      </View>

      {renderFormularioExercicio()}

      <View style={styles.exerciciosSection}>
        
        <Text style={styles.sectionTitle}>
          Exercícios ({exercicios.length})
        </Text>
        
        <FlatList
          data={exercicios}
          renderItem={renderExercicio}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="barbell-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum exercício adicionado</Text>
            </View>
          }
        />
      </View>
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
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  treinoHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  treinoInfo: {
    alignItems: 'center',
  },
  treinoTipo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  treinoData: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  treinoDuracao: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  treinoDistancia: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  formularioContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formularioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  debugBanner: {
    backgroundColor: '#fff8e1',
    padding: 8,
    margin: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
  },
  debugText: {
    fontSize: 12,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputHalf: {
    flex: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  adicionarButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    marginTop: 8,
  },
  adicionarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciciosSection: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  exercicioCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exercicioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exercicioNome: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  exercicioInfo: {
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
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  infoCardText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 10,
    flex: 1,
  },
});
