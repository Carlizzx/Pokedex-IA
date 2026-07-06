# Pokédex IA

Uma Pokédex web construída em React que consome a [PokéAPI](https://pokeapi.co/) para exibir dados detalhados de Pokémons, e conta com um assistente de IA temático (Ash Ferreira) para tirar dúvidas sobre o universo Pokémon diretamente na página do Pokémon selecionado.

## 📖 Sobre o projeto

O objetivo é oferecer uma experiência de Pokédex moderna, onde o usuário pode:

- Navegar entre Pokémons e ver seus dados detalhados (tipos, stats, habilidades, altura, peso, versão shiny)
- Conversar com um assistente de IA especializado no universo Pokémon, que já sabe qual Pokémon está sendo visualizado no momento — sem precisar informar o nome a cada pergunta

## ✨ Funcionalidades

- 🔍 Busca e listagem de Pokémons
- 📄 Página de perfil detalhada por Pokémon, com:
  - Tipos, estatísticas base (HP, Ataque, Defesa, etc.)
  - Imagem normal e versão shiny
  - Lista de habilidades (incluindo habilidades ocultas) com descrição expansível, buscada sob demanda na PokéAPI
  - Altura e peso
- 💬 Chat flutuante com IA (`ChatIA`), que:
  - Responde apenas perguntas relacionadas ao universo Pokémon (jogos, anime, TCG, competitivo, lore, etc.)
  - Sabe qual Pokémon está sendo exibido na tela no momento da pergunta, respondendo coisas como "quais as fraquezas desse Pokémon?" sem precisar informar o nome
  - Mantém histórico de mensagens da conversa durante a sessão

## 🛠️ Tecnologias

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- [PokéAPI](https://pokeapi.co/) — dados dos Pokémons
- [OpenRouter](https://openrouter.ai/) — modelo de IA usado no chat (`nvidia/nemotron-3-ultra-550b-a55b:free`)
- CSS puro (arquivos `.css` por componente)

## 🧠 Decisões técnicas

**React + Vite**
Vite foi escolhido pelo tempo de build e hot-reload muito mais rápidos que alternativas como Create React App, o que agiliza o desenvolvimento de um projeto de pequeno porte.

**React Router para navegação**
As páginas de perfil usam rota dinâmica (`/pokemon/:id`), permitindo carregar os dados do Pokémon certo a partir do parâmetro da URL (`useParams`) e possibilitando compartilhar/favoritar o link de um Pokémon específico.

**Busca de habilidades sob demanda (lazy load)**
As descrições de habilidades não vêm prontas na chamada principal da PokéAPI — cada habilidade tem sua própria URL de detalhe. Em vez de buscar todas de uma vez (o que geraria requisições desnecessárias para habilidades que o usuário talvez nunca abra), a descrição só é buscada quando o usuário clica para expandir aquela habilidade específica, com cache em estado local (`abilityDescriptions`) para não repetir a requisição se for reaberta.

**Assistente de IA com escopo restrito (prompt engineering)**
O prompt de sistema define a persona "Ash Ferreira" e limita explicitamente o assistente a responder apenas sobre o universo Pokémon, com instruções para resistir a tentativas de sair do personagem (prompt injection). Essa abordagem evita que o chat seja usado como um chatbot genérico e mantém a experiência temática.

**Chave de API via variável de ambiente**
A chave da OpenRouter é lida via `import.meta.env.VITE_OPENROUTER_API_KEY` (padrão do Vite) em vez de ficar hardcoded no código, evitando exposição direta no repositório. Vale reforçar que, mesmo assim, qualquer variável `VITE_*` fica visível no bundle final do frontend — para um cenário de produção real, o ideal é mover essa chamada para um backend/serverless function.

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (vem junto com o Node.js)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Carlizzx/Pokedex-IA

# 2. Entre na pasta do projeto
cd pokedex-ia

# 3. Instale as dependências
npm install
```

```bash
# 5. Rode o projeto em modo desenvolvimento
npm run dev
```

Depois disso, o terminal vai mostrar um endereço local, geralmente:

```
http://localhost:5173
```

Abra esse endereço no navegador para ver o projeto rodando.

## 🔑 Como conseguir uma chave (API Key) da OpenRouter

O chat com IA usa a [OpenRouter](https://openrouter.ai/) para acessar o modelo de linguagem. Siga estes passos para gerar sua própria chave gratuita:

1. Acesse **[https://openrouter.ai](https://openrouter.ai)**
2. Clique em **Sign In** (ou **Sign Up**, se ainda não tiver conta) — dá pra entrar com conta Google ou GitHub
3. Depois de logado, clique no seu ícone/avatar no canto superior direito e vá em **Keys** (ou acesse diretamente **[https://openrouter.ai/keys](https://openrouter.ai/keys)**)
4. Clique em **Create Key**
5. Dê um nome para a chave (ex: `pokedex-ia-dev`) e confirme
6. Copie a chave gerada (formato `sk-or-v1-...`) — **ela só é exibida uma vez**, então guarde em local seguro
7. Cole essa chave no arquivo `.env` do projeto (veja próxima seção)

> 💡 O modelo usado neste projeto (`nvidia/nemotron-3-ultra-550b-a55b:free`) é gratuito, mas a OpenRouter pode aplicar limites de uso (rate limits) para contas gratuitas. Se precisar de mais volume ou modelos pagos, é possível adicionar créditos na sua conta.

## ⚙️ Configurando as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto (mesmo nível do `package.json`):

```
VITE_OPENROUTER_API_KEY=sk-or-v1-sua_chave_aqui
```

Depois de criar ou editar o `.env`, **pare o servidor (Ctrl+C) e rode `npm run dev` novamente** — o Vite só lê essas variáveis na inicialização.

## 🤖 Sobre o assistente de IA

O chat é alimentado por um prompt de sistema que dá à IA a persona "Ash Ferreira", um treinador Pokémon que:

- Só responde perguntas relacionadas ao universo Pokémon
- Recusa educadamente perguntas fora do tema, mesmo diante de tentativas de "burlar" as regras
- Recebe como contexto o Pokémon que está sendo visualizado na página atual, permitindo perguntas como "quais as fraquezas desse Pokémon?"

O contexto do Pokémon atual é injetado automaticamente na conversa a partir dos dados já carregados na página de perfil (nome, tipos, altura, peso e habilidades).

## 📌 Possíveis melhorias futuras

- [ ] Mover a chamada à API da OpenRouter para um backend, evitando expor a chave no frontend
- [ ] Cache de descrições de habilidades já consultadas entre sessões (ex: localStorage)
- [ ] Histórico de conversas persistente
- [ ] Testes automatizados dos componentes principais.
