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
import desafioService from '../services/desafioService';

export default function NovoDesafioScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [objetivoValor, setObjetivoValor] = useState('');
  const [progressoAtual, setProgressoAtual] = useState('0');
  const [unidade, setUnidade] = useState('KM');
  const [status, setStatus] = useState('PENDENTE');
  const [loading, setLoading] = useState(false);

  const unidades = [
    { value: 'KM', label: 'Quilômetros' },
    { value: 'REPETICOES', label: 'Repetições' },
    { value: 'CALORIAS', label: 'Calorias' },
    { value: 'MINUTOS', label: 'Minutos' },
  ];

  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  const validarCampos = () => {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Informe o título do desafio');
      return false;
    }
    if (!objetivoValor || parseFloat(objetivoValor) <= 0) {
      Alert.alert('Erro', 'Informe um valor objetivo válido');
      return false;
    }
    return true;
  };

  const salvarDesafio = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);

      const dados = {
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        objetivoValor: parseFloat(objetivoValor),
        progressoAtual: parseFloat(progressoAtual),
        unidade: unidade,
        status: status,
        dataInicio: new Date().toISOString().split('T')[0], // Data atual
        dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias depois
      };

      await desafioService.criar(dados);
      Alert.alert('Sucesso', 'Desafio cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar desafio:', error);
      Alert.alert('Erro', 'Não foi possível salvar o desafio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.label}>Título do Desafio *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: Correr 100km em um mês"
        />

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva o desafio..."
          multiline
          numberOfLines={4}
        />

        {/* Objetivo e Progresso */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Valor Objetivo *</Text>
            <TextInput
              style={styles.input}
              value={objetivoValor}
              onChangeText={setObjetivoValor}
              placeholder="Ex: 100"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Progresso Atual</Text>
            <TextInput
              style={styles.input}
              value={progressoAtual}
              onChangeText={setProgressoAtual}
              placeholder="Ex: 0"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Unidade */}
        <Text style={styles.label}>Unidade *</Text>
        <View style={styles.unidadeContainer}>
          {unidades.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.unidadeButton,
                unidade === item.value && styles.unidadeButtonActive,
              ]}
              onPress={() => setUnidade(item.value)}
            >
              <Text
                style={[
                  styles.unidadeButtonText,
                  unidade === item.value && styles.unidadeButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status */}
        <Text style={styles.label}>Status Inicial</Text>
        <View style={styles.statusContainer}>
          {statusOptions.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.statusButton,
                status === item.value && styles.statusButtonActive,
              ]}
              onPress={() => setStatus(item.value)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === item.value && styles.statusButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
            onPress={salvarDesafio}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="trophy" size={20} color="#fff" />
                <Text style={styles.buttonPrimaryText}>Salvar Desafio</Text>
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  unidadeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unidadeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  unidadeButtonActive: {
    backgroundColor: '#007AFF',
  },
  unidadeButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  unidadeButtonTextActive: {
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  statusButtonTextActive: {
    color: '#fff',
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
