# 📱 MyTraining Mobile

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Aplicativo mobile para gerenciamento de treinos e desafios fitness**

[Características](#-características) •
[Tecnologias](#-tecnologias) •
[Instalação](#-instalação) •
[Uso](#-como-usar) •
[Estrutura](#-estrutura-do-projeto) •
[API](#-conexão-com-backend)

</div>

---

## 📋 Sobre o Projeto

MyTraining Mobile é um aplicativo desenvolvido em React Native que permite aos usuários registrar seus treinos, acompanhar estatísticas e participar de desafios fitness. O app consome uma API REST desenvolvida em Spring Boot.

### ✨ Características

- 🏋️ **Gerenciamento de Treinos**: Crie, visualize e exclua treinos de musculação, corrida e ciclismo
- 🏆 **Desafios**: Acompanhe desafios ativos, concluídos e pendentes
- 📊 **Estatísticas**: Visualize suas estatísticas de treinos e desafios
- 🔄 **Pull to Refresh**: Atualize os dados arrastando a tela para baixo
- 📱 **Interface Intuitiva**: Design moderno e responsivo
- 🎨 **Navegação Fluida**: Navegação por tabs e stack navigation

---

## 🛠️ Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **[React Native](https://reactnative.dev/)** - Framework para desenvolvimento mobile
- **[Expo](https://expo.dev/)** - Plataforma para desenvolvimento React Native
- **[React Navigation](https://reactnavigation.org/)** - Biblioteca de navegação
- **[Axios](https://axios-http.com/)** - Cliente HTTP para requisições à API
- **[Expo Vector Icons](https://docs.expo.dev/guides/icons/)** - Biblioteca de ícones

---

## 📦 Instalação

### Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) instalado no seu celular (Android/iOS)

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/henriquebcorrea/my-training-mobile.git
cd my-training-mobile
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o endereço da API**

Abra o arquivo `src/services/api.js` e altere o IP para o IP da sua máquina:

```javascript
const API_URL = 'http://SEU_IP_AQUI:8080/api';
```

> 💡 **Dica**: Para descobrir seu IP no Windows, execute `ipconfig` no CMD e procure por "Endereço IPv4"

4. **Inicie o projeto**
```bash
npx expo start
```

5. **Abra no celular**
   - Escaneie o QR Code que aparece no terminal usando o app **Expo Go**
   - Certifique-se de que seu celular e computador estão na **mesma rede Wi-Fi**

---

## 🚀 Como Usar

### Conectando com o Backend

1. **Certifique-se de que o backend Spring Boot está rodando** na porta 8080

2. **Atualize o IP** em `src/services/api.js` com o IP da sua máquina:
```javascript
const API_URL = 'http://192.168.X.X:8080/api';
```

3. **Inicie o aplicativo**:
```bash
npx expo start
```

4. **Abra no Expo Go** escaneando o QR Code

> ⚠️ **Importante**: Seu celular e o computador com o backend devem estar na mesma rede Wi-Fi

---

## 📁 Estrutura do Projeto

```
mytraining-mobile/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── navigation/          # Configuração de navegação
│   │   └── AppNavigator.js  # Navegação principal
│   ├── screens/             # Telas do aplicativo
│   │   ├── HomeScreen.js    # Tela inicial
│   │   ├── TreinosScreen.js # Lista de treinos
│   │   ├── DesafiosScreen.js # Lista de desafios
│   │   └── NovoTreinoScreen.js # Formulário de novo treino
│   └── services/            # Serviços e API
│       ├── api.js           # Configuração do Axios
│       ├── mockData.js      # Dados para teste
│       ├── treinoService.js # Serviço de treinos
│       ├── desafioService.js # Serviço de desafios
│       └── usuarioService.js # Serviço de usuários
├── assets/                  # Imagens e recursos
├── App.js                   # Componente principal
├── app.json                 # Configuração do Expo
├── package.json             # Dependências do projeto
└── README.md                # Documentação
```

---

## 🔌 Conexão com Backend

### Endpoints utilizados

O app consome os seguintes endpoints da API:

#### **Treinos**
- `GET /api/treinos` - Lista todos os treinos
- `GET /api/treinos/{id}` - Busca treino por ID
- `POST /api/treinos` - Cria novo treino
- `PUT /api/treinos/{id}` - Atualiza treino
- `DELETE /api/treinos/{id}` - Deleta treino
- `GET /api/treinos/usuario/{usuarioId}` - Lista treinos por usuário

#### **Desafios**
- `GET /api/desafios` - Lista todos os desafios
- `GET /api/desafios/{id}` - Busca desafio por ID
- `POST /api/desafios` - Cria novo desafio
- `PUT /api/desafios/{id}` - Atualiza desafio
- `DELETE /api/desafios/{id}` - Deleta desafio
- `GET /api/desafios/status/{status}` - Lista desafios por status

#### **Usuários**
- `GET /api/usuarios` - Lista todos os usuários
- `GET /api/usuarios/{id}` - Busca usuário por ID
- `POST /api/usuarios` - Cria novo usuário
- `PUT /api/usuarios/{id}` - Atualiza usuário

### Formato dos dados

**Criar Treino:**
```json
{
  "dataHora": "2025-10-21T19:30:00",
  "tipo": "MUSCULACAO",
  "duracaoMin": 60,
  "observacoes": "Treino de peito",
  "distanciaKm": null,
  "usuarioId": 1,
  "exercicios": []
}
```

**Criar Desafio:**
```json
{
  "titulo": "Desafio 30 dias",
  "descricao": "Treinar todos os dias",
  "dataInicio": "2025-10-01",
  "dataFim": "2025-10-30",
  "objetivoValor": 30,
  "unidade": "REPETICOES",
  "status": "ATIVO"
}
```

---

## 🎨 Telas do Aplicativo

### 🏠 Home
<img width="397" height="853" alt="home" src="https://github.com/user-attachments/assets/645cd478-c426-4837-93db-029826423a47" />

### 🏋️ Treinos
<img width="397" height="857" alt="treinos" src="https://github.com/user-attachments/assets/dfadbd42-63c2-46b5-914a-7368692072e4" />

### 🏋️ Criar treinos
<img width="402" height="851" alt="criar_treino" src="https://github.com/user-attachments/assets/e53166c7-f8a4-4f67-bdca-24470f931cd2" />

### 🏋️ Adicionar exercicios musculação
<img width="400" height="857" alt="exercicios_musculacao" src="https://github.com/user-attachments/assets/30c0762c-b8c1-496a-ad41-3b9e540fddb7" />

### 🏆 Desafios
<img width="408" height="858" alt="desafios" src="https://github.com/user-attachments/assets/104187e9-7306-4188-b42e-2c98adc8d612" />

### 🏆 Criar desafios
<img width="411" height="859" alt="criar_desafio" src="https://github.com/user-attachments/assets/0fd86731-87e0-4ff7-b93d-486e0fd6b1a7" />


---

## 🐛 Resolução de Problemas

### O app não conecta com o backend

**Solução:**
1. Verifique se o backend está rodando na porta 8080
2. Confirme que celular e computador estão na mesma rede Wi-Fi
3. Verifique se o IP em `api.js` está correto
4. Desabilite firewall/antivírus temporariamente para testar

### Erro "Network Error"

**Solução:**
1. Certifique-se de usar o IP correto (não use `localhost` ou `127.0.0.1`)
2. Use o formato `http://192.168.X.X:8080/api`
3. Verifique se não há proxy ou VPN ativa

### App trava ao abrir

**Solução:**
```bash
# Limpe o cache
npx expo start -c

# Reinstale dependências
rm -rf node_modules
npm install
```

---

## 📝 Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento
npm start

# Inicia com cache limpo
npx expo start -c

# Abre no Android
npm run android

# Abre no iOS
npm run ios

# Abre no navegador
npm run web
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 👥 Autores

Desenvolvido por **Henrique Correa e Gustavo Rocha** como projeto do curso de Desenvolvimento de Sistemas.

---

## 📞 Suporte

Se você tiver alguma dúvida ou problema, abra uma [issue](https://github.com/seu-usuario/mytraining-mobile/issues) no GitHub.

---

<div align="center">

**Feito com ❤️ e React Native**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
