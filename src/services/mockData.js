// dados mockados para testar o app sem backend

let treinos = [
  {
    id: 1,
    dataHora: new Date().toISOString(),
    tipo: 'MUSCULACAO',
    duracaoMin: 60,
    observacoes: 'Treino de peito e tríceps',
    distanciaKm: null,
    usuarioId: 1,
    usuarioNome: 'João Silva',
    exercicios: [
      {
        id: 1,
        nome: 'Supino reto',
        series: 4,
        repeticoes: 12,
        cargaKg: 80,
        observacoes: 'Boa execução',
        treinoId: 1,
      },
      {
        id: 2,
        nome: 'Tríceps pulley',
        series: 3,
        repeticoes: 15,
        cargaKg: 30,
        observacoes: null,
        treinoId: 1,
      },
    ],
  },
  {
    id: 2,
    dataHora: new Date(Date.now() - 86400000).toISOString(),
    tipo: 'CORRIDA',
    duracaoMin: 45,
    observacoes: 'Corrida leve',
    distanciaKm: 7.5,
    usuarioId: 1,
    usuarioNome: 'João Silva',
    exercicios: [],
  },
  {
    id: 3,
    dataHora: new Date(Date.now() - 172800000).toISOString(),
    tipo: 'CICLISMO',
    duracaoMin: 90,
    observacoes: 'Passeio no parque',
    distanciaKm: 25.0,
    usuarioId: 1,
    usuarioNome: 'João Silva',
    exercicios: [],
  },
];

let desafios = [
  {
    id: 1,
    titulo: 'Desafio 30 dias de corrida',
    descricao: 'Corra pelo menos 5km por dia durante 30 dias',
    dataInicio: '2025-10-01',
    dataFim: '2025-10-30',
    objetivoValor: 150.0,
    unidade: 'KM',
    status: 'ATIVO',
  },
  {
    id: 2,
    titulo: 'Maratona de Treinos',
    descricao: 'Complete 20 treinos de musculação em um mês',
    dataInicio: '2025-10-01',
    dataFim: '2025-10-31',
    objetivoValor: 20.0,
    unidade: 'REPETICOES',
    status: 'ATIVO',
  },
  {
    id: 3,
    titulo: 'Queima de Calorias',
    descricao: 'Queime 10.000 calorias no mês',
    dataInicio: '2025-10-01',
    dataFim: '2025-10-31',
    objetivoValor: 10000.0,
    unidade: 'CALORIAS',
    status: 'PENDENTE',
  },
  {
    id: 4,
    titulo: 'Desafio Setembro',
    descricao: 'Desafio completo!',
    dataInicio: '2025-09-01',
    dataFim: '2025-09-30',
    objetivoValor: 100.0,
    unidade: 'KM',
    status: 'CONCLUIDO',
  },
];

let usuarios = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    roles: [
      { id: 1, nome: 'ROLE_USER' },
    ],
    desafios: [],
  },
];

let nextTreinoId = 4;
let nextDesafioId = 5;

export const mockTreinoService = {
  listarTodos: () => Promise.resolve([...treinos]),
  
  criar: (dados) => {
    const novoTreino = {
      ...dados,
      id: nextTreinoId++,
      usuarioNome: 'João Silva',
      exercicios: dados.exercicios || [],
    };
    treinos.unshift(novoTreino);
    return Promise.resolve(novoTreino);
  },
  
  buscarPorId: (id) => {
    const treino = treinos.find(t => t.id === id);
    return treino ? Promise.resolve(treino) : Promise.reject(new Error('Treino não encontrado'));
  },
  
  deletar: (id) => {
    treinos = treinos.filter(t => t.id !== id);
    return Promise.resolve(true);
  },
  
  atualizar: (id, dados) => {
    const index = treinos.findIndex(t => t.id === id);
    if (index !== -1) {
      treinos[index] = { ...treinos[index], ...dados };
      return Promise.resolve(treinos[index]);
    }
    return Promise.reject(new Error('Treino não encontrado'));
  },
};

export const mockDesafioService = {
  listarTodos: () => Promise.resolve([...desafios]),
  
  criar: (dados) => {
    const novoDesafio = {
      ...dados,
      id: nextDesafioId++,
    };
    desafios.unshift(novoDesafio);
    return Promise.resolve(novoDesafio);
  },
  
  buscarPorId: (id) => {
    const desafio = desafios.find(d => d.id === id);
    return desafio ? Promise.resolve(desafio) : Promise.reject(new Error('Desafio não encontrado'));
  },
  
  buscarPorStatus: (status) => {
    const resultado = desafios.filter(d => d.status === status);
    return Promise.resolve(resultado);
  },
  
  deletar: (id) => {
    desafios = desafios.filter(d => d.id !== id);
    return Promise.resolve(true);
  },
  
  atualizar: (id, dados) => {
    const index = desafios.findIndex(d => d.id === id);
    if (index !== -1) {
      desafios[index] = { ...desafios[index], ...dados };
      return Promise.resolve(desafios[index]);
    }
    return Promise.reject(new Error('Desafio não encontrado'));
  },
};

export const mockUsuarioService = {
  listarTodos: () => Promise.resolve([...usuarios]),
  
  buscarPorId: (id) => {
    const usuario = usuarios.find(u => u.id === id);
    return usuario ? Promise.resolve(usuario) : Promise.reject(new Error('Usuário não encontrado'));
  },
};