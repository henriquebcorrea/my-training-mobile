import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import treinoService from '../services/treinoService';

export default function NovoTreinoScreen({ navigation }) {
  const [tipo, setTipo] = useState('MUSCULACAO');
  const [duracaoMin, setDuracaoMin] = useState('');
  const [distanciaKm, setDistanciaKm] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const tiposTreino = [
    { value: 'MUSCULACAO', label: 'Musculação', icon: 'barbell' },
    { value: 'CORRIDA', label: 'Corrida', icon: 'walk' },
    { value: 'CICLISMO', label: 'Ciclismo', icon: 'bicycle' },
  ];

  const validarCampos = () => {
    if (!duracaoMin || parseInt(duracaoMin) <= 0) {
      Alert.alert('Erro', 'Informe a duração do treino');
      return false;
    }
    return true;
  };

  const salvarTreino = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);

      const dados = {
        dataHora: new Date().toISOString(),
        tipo: tipo,
        duracaoMin: parseInt(duracaoMin),
        observacoes: observacoes || null,
        distanciaKm: distanciaKm ? parseFloat(distanciaKm) : null,
        usuarioId: null, // Será definido pelo backend usando o usuário autenticado
        exercicios: [],
      };

      await treinoService.criar(dados);
      Alert.alert('Sucesso', 'Treino cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      Alert.alert('Erro', 'Não foi possível salvar o treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Tipo de Treino */}
        <Text style={styles.label}>Tipo de Treino *</Text>
        <View style={styles.tipoContainer}>
          {tiposTreino.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.tipoButton,
                tipo === item.value && styles.tipoButtonActive,
              ]}
              onPress={() => setTipo(item.value)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={tipo === item.value ? '#fff' : '#007AFF'}
              />
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === item.value && styles.tipoButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duração */}
        <Text style={styles.label}>Duração (minutos) *</Text>
        <TextInput
          style={styles.input}
          value={duracaoMin}
          onChangeText={setDuracaoMin}
          placeholder="Ex: 60"
          keyboardType="numeric"
        />

        {/* Distância (opcional para corrida/ciclismo) */}
        {(tipo === 'CORRIDA' || tipo === 'CICLISMO') && (
          <>
            <Text style={styles.label}>Distância (km)</Text>
            <TextInput
              style={styles.input}
              value={distanciaKm}
              onChangeText={setDistanciaKm}
              placeholder="Ex: 5.5"
              keyboardType="decimal-pad"
            />
          </>
        )}

        {/* Observações */}
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Como foi o treino?"
          multiline
          numberOfLines={4}
        />

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={salvarTreino}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.buttonPrimaryText}>Salvar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  tipoButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  tipoButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tipoButtonText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
    fontWeight: '600',
  },
  tipoButtonTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});