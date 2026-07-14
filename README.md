# Meu Amigo Jesus ✝️

Jogo interativo e lúdico para crianças aprenderem sobre toda a vida de Jesus Cristo, da Anunciação à Ascensão ao céu.

## Como funciona

A criança entra com seu nome e se torna **amigo(a) de Jesus**. Depois acompanha Jesus em **23 fases interativas**, cada uma com um tipo diferente de interação:

1. 👼 **A Anunciação** — Toque no anjo Gabriel (clicar)
2. ⭐ **Jesus Nasce** — Toque na estrela de Belém (clicar)
3. 🐑 **Os Pastores** — Encontre os 3 pastores escondidos (encontrar)
4. 👑 **Os Reis Magos** — Siga as estrelas na ordem certa (sequência)
5. 🏛️ **Simeão no Templo** — Responda a pergunta (quiz)
6. 📖 **Jesus aos 12 Anos** — Responda a pergunta (quiz)
7. 💧 **O Batismo** — Toque em Jesus no rio (clicar)
8. 🪨 **A Tentação** — Escolha: Palavra de Deus ou comida (escolha)
9. 🎣 **Pescadores de Homens** — Toque nos 4 pescadores (clicar múltiplo)
10. 💧 **Bodas de Cana** — Arraste as jarras até Jesus (arrastar)
11. 😊 **As Bem-Aventuranças** — Complete a frase (completar)
12. 👁️ **Jesus Cura o Cego** — Toque no cego para o milagre (clicar)
13. 🍞 **Multiplicação dos Pães** — Conte e responda (contar)
14. 🌊 **Jesus Anda Sobre a Água** — Toque em Jesus (clicar)
15. 🌱 **Parábola do Semeador** — Arraste as sementes para a boa terra (arrastar)
16. 🌳 **Zaqueu na Árvore** — Toque na árvore (clicar)
17. ❤️ **O Bom Samaritano** — Coloque a história em ordem (sequência)
18. 🌿 **Entrada em Jerusalém** — Toque nos ramos (clicar múltiplo)
19. 🍞 **A Última Ceia** — Toque no pão e no vinho (clicar múltiplo)
20. 🌙 **Jesus no Getsêmani** — Toque nas gotas de oração (orar)
21. ✝️ **O Amor Maior** — Toque no coração (clicar)
22. 🌅 **Jesus Ressuscitou** — Toque na pedra do túmulo (clicar)
23. ☁️ **A Ascensão ao Céu** — Toque em Jesus para subir ao céu (clicar)

## Tipos de Interação

- **Clicar**: Toque em um elemento para ativar a animação
- **Clicar Múltiplo**: Toque em vários elementos para completar
- **Encontrar**: Encontre elementos escondidos no cenário
- **Sequência**: Toque nos elementos na ordem certa
- **Arrastar**: Arraste elementos até o destino correto
- **Quiz**: Responda uma pergunta com múltipla escolha
- **Escolha**: Escolha entre duas opções (certa/errada)
- **Completar**: Complete uma frase bíblica
- **Contar**: Conte elementos e responda
- **Orar**: Toque em gotas de oração

## Características

- **Tela de nome**: A criança entra com seu nome e Jesus fala diretamente com ela
- **Versículos bíblicos**: Cada fase mostra o versículo e a lição
- **TTS (Text-to-Speech)**: Todas as interações falam em português
- **Visual e intuitivo**: Emojis grandes, cores vibrantes, fontes grandes
- **Animações únicas**: Cada fase tem animações próprias e conclusões especiais
- **23 medalhas**: Uma medalha para cada fase concluída
- **Sistema de estrelas**: Acumule estrelas a cada fase
- **Progresso salvo**: Continua de onde parou
- **Botão de ajuda**: Em cada fase, a criança pode pedir ajuda
- **Tela final comemorativa**: Celebra a conclusão de toda a jornada

## Estrutura do Projeto

- `index.html` — Estrutura HTML com telas de nome, inicial e jogo
- `style.css` — Estilos completos com animações para todos os 23 cenários
- `phases.js` — Definições das 23 fases e 23 medalhas
- `interactions.js` — Renderizadores de cenário e handlers de interação
- `game.js` — Lógica principal do jogo, estado e fluxo
- `tts.js` — Text-to-Speech (Web Speech API + servidor local opcional)

## Como rodar

Abra `index.html` no navegador, ou inicie um servidor local:

```bash
python -m http.server 8080
```

Acesse `http://localhost:8080`

## Tecnologias

- HTML5
- CSS3 (animações, gradientes, responsivo, drag-and-drop)
- JavaScript puro (sem dependências)
- Web Speech API + servidor TTS local (opcional)
