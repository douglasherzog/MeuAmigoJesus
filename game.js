// MEU AMIGO JESUS - Jogo completo e independente

const FASES = [
    {
        id: 'nascimento', numero: 1, emoji: '⭐', titulo: 'JESUS NASCE',
        fala: 'Yoyo, eu nasci em Belém! Uma estrela brilhante guiou os Reis Magos! ✨',
        instrucao: 'Toque na estrela para guiar os Reis Magos!',
        cenario: 'nascimento', acao: 'clicar-estrela', medalha: 'amigo_jesus',
        som: 'Brilha brilha estrelinha!'
    },
    {
        id: 'batismo', numero: 2, emoji: '💧', titulo: 'JESUS E BATIZADO',
        fala: 'João me batizou no rio! O Espírito Santo desceu como uma pomba! 🕊️',
        instrucao: 'Toque em Jesus para mergulhar no rio!',
        cenario: 'batismo', acao: 'clicar-jesus', medalha: 'batismo',
        som: 'Glória a Deus!'
    },
    {
        id: 'deserto', numero: 3, emoji: '🪨', titulo: 'JESUS NO DESERTO',
        fala: 'No deserto, o mal me ofereceu comida, mas eu escolhi obedecer a Deus! 📖',
        instrucao: 'Escolha: comida ou Bíblia?',
        cenario: 'deserto', acao: 'escolha', medalha: 'obediente',
        som: 'Eu escolho Deus!'
    },
    {
        id: 'pescadores', numero: 4, emoji: '🎣', titulo: 'PESCADORES DE HOMENS',
        fala: 'Eu chamei meus amigos pescadores: Pedro, André, Tiago e João! Venham comigo! 🎣',
        instrucao: 'Toque nos pescadores para eles seguirem Jesus!',
        cenario: 'pescadores', acao: 'clicar-pescadores', medalha: 'discipulo',
        som: 'Vamos seguir Jesus!'
    },
    {
        id: 'bemaventurancas', numero: 5, emoji: '😊', titulo: 'JESUS ENSINA',
        fala: 'Eu ensinei no monte: felizes são os que amam a Deus e aos outros! 😊',
        instrucao: 'Toque nas crianças para abraçar o amor de Jesus!',
        cenario: 'monte', acao: 'clicar-criancas', medalha: 'abençoada',
        som: 'Eu sou feliz com Jesus!'
    },
    {
        id: 'curaciego', numero: 6, emoji: '👁️', titulo: 'JESUS CURA',
        fala: 'Eu curei um cego com amor! Jesus cuida de todos! ✨',
        instrucao: 'Toque no cego para Jesus fazer o milagre!',
        cenario: 'curaciego', acao: 'clicar-cego', medalha: 'milagre',
        som: 'Agora eu vejo!'
    },
    {
        id: 'paes', numero: 7, emoji: '🍞', titulo: 'JESUS MULTIPLICA',
        fala: 'Com poucos pães e peixes, eu alimentei muitas pessoas! 🍞🐟',
        instrucao: 'Toque na cesta para multiplicar a comida!',
        cenario: 'paes', acao: 'clicar-paes', medalha: 'compaixao',
        som: 'Obrigado, Jesus!'
    },
    {
        id: 'aguas', numero: 8, emoji: '🌊', titulo: 'JESUS ANDA SOBRE AGUA',
        fala: 'Eu andei sobre o mar para chegar até meus amigos! Não tenham medo! 🌊',
        instrucao: 'Toque em Jesus para caminhar sobre as águas!',
        cenario: 'aguas', acao: 'clicar-aguas', medalha: 'fe',
        som: 'Jesus tem poder!'
    },
    {
        id: 'zaqueu', numero: 9, emoji: '🌳', titulo: 'ZAQUEU SOBE NA ARVORE',
        fala: 'Zaqueu era pequeno e subiu em uma árvore para me ver! Eu disse: vou na sua casa! 🌳',
        instrucao: 'Toque na árvore para abaixar Zaqueu!',
        cenario: 'zaqueu', acao: 'clicar-arvore', medalha: 'amigo',
        som: 'Jesus vem na minha casa!'
    },
    {
        id: 'jerusalem', numero: 10, emoji: '🌿', titulo: 'ENTRADA EM JERUSALEM',
        fala: 'As pessoas me receberam com alegria! Elas gritavam: Hosana! O Rei está chegando! 🌿',
        instrucao: 'Toque nos ramos para agitar e dizer Hosana!',
        cenario: 'jerusalem', acao: 'clicar-ramos', medalha: 'hosana',
        som: 'Hosana! Hosana!'
    },
    {
        id: 'ceia', numero: 11, emoji: '🍞', titulo: 'A ULTIMA CEIA',
        fala: 'Eu partilhei pão e vinho com meus amigos. Eles devem lembrar de mim sempre! 🍞🍷',
        instrucao: 'Toque no pão e no vinho para partilhar com Jesus!',
        cenario: 'ceia', acao: 'clicar-ceia', medalha: 'ceia',
        som: 'Eu lembro de você, Jesus!'
    },
    {
        id: 'cruz', numero: 12, emoji: '✝️', titulo: 'JESUS NOS AMA',
        fala: 'Eu sofri muito, mas foi porque amo muito você, Yoyo. O amor de Jesus é maior que tudo! 💜',
        instrucao: 'Toque no coração para sentir o amor de Jesus!',
        cenario: 'cruz', acao: 'clicar-coracao', medalha: 'amor_maior',
        som: 'Jesus me ama!'
    },
    {
        id: 'ressurreicao', numero: 13, emoji: '🌅', titulo: 'JESUS RESSUSCITOU',
        fala: 'No terceiro dia, eu voltei! A morte não venceu! Jesus vive para sempre! ✨',
        instrucao: 'Toque na pedra para ver o túmulo vazio!',
        cenario: 'ressurreicao', acao: 'clicar-pedra', medalha: 'ressurreicao',
        som: 'Jesus vive! Aleluia!'
    }
];

const MEDALHAS = [
    { id: 'amigo_jesus', nome: 'AMIGO JESUS', emoji: '✝️' },
    { id: 'batismo', nome: 'BATIZADO', emoji: '💧' },
    { id: 'obediente', nome: 'OBEDIENTE', emoji: '📖' },
    { id: 'discipulo', nome: 'DISCIPULO', emoji: '🎣' },
    { id: 'abençoada', nome: 'ABENÇOADA', emoji: '😊' },
    { id: 'milagre', nome: 'MILAGRE', emoji: '✨' },
    { id: 'compaixao', nome: 'AMOR', emoji: '💖' },
    { id: 'fe', nome: 'FE', emoji: '🌊' },
    { id: 'amigo', nome: 'AMIGO', emoji: '🌳' },
    { id: 'hosana', nome: 'HOSANA', emoji: '🌿' },
    { id: 'ceia', nome: 'CEIA', emoji: '🍞' },
    { id: 'amor_maior', nome: 'AMOR MAIOR', emoji: '💜' },
    { id: 'ressurreicao', nome: 'RESSURREICAO', emoji: '🌅' },
];

let estado = { faseIndex: 0, estrelas: 0, medalhas: [] };

function carregarEstado() {
    try {
        const salvo = localStorage.getItem('meuamigojesus-save');
        if (salvo) return JSON.parse(salvo);
    } catch (e) { console.log('Erro ao carregar', e); }
    return { faseIndex: 0, estrelas: 0, medalhas: [] };
}

function salvarEstado() {
    localStorage.setItem('meuamigojesus-save', JSON.stringify(estado));
}

// Criar estrelas de fundo
function criarEstrelas() {
    const bg = document.getElementById('stars-bg');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star-dot';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        bg.appendChild(star);
    }
}

// Mostrar tela inicial
function mostrarTelaInicial() {
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';

    const medalsDiv = document.getElementById('start-medals');
    medalsDiv.innerHTML = '';
    MEDALHAS.forEach(m => {
        const span = document.createElement('span');
        span.className = 'start-medal' + (estado.medalhas.includes(m.id) ? ' unlocked' : '');
        span.textContent = m.emoji;
        span.title = m.nome;
        medalsDiv.appendChild(span);
    });
}

// Iniciar jogo
function iniciarJogo() {
    falar('Vamos aprender com Jesus!');
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    atualizarTela();
}

// Atualizar tela
function atualizarTela() {
    const fase = FASES[estado.faseIndex];
    if (!fase) return;

    document.getElementById('phase-badge').textContent = 'FASE ' + fase.numero;
    document.getElementById('stars-count').textContent = estado.estrelas;
    document.getElementById('phase-emoji').textContent = fase.emoji;
    document.getElementById('phase-title').textContent = fase.titulo;
    document.getElementById('phase-instruction').textContent = fase.instrucao;
    document.getElementById('speech-bubble').textContent = fase.fala;
    falar(fase.fala);

    renderizarCenario(fase);
    atualizarBotoes(fase);
    atualizarProgresso();
    atualizarMedalhas();
}

// Renderizar cenário
function renderizarCenario(fase) {
    const bg = document.getElementById('scene-background');
    const content = document.getElementById('scene-content');
    bg.className = 'scene-background ' + fase.cenario;
    content.innerHTML = '';

    switch (fase.cenario) {
        case 'nascimento':
            content.innerHTML = `
                <div class="angel">👼</div>
                <div class="stable">⛺</div>
                <div class="star-of-bethlehem interactive-element" id="star-bethlehem">⭐</div>
                <div style="position:absolute; bottom:5%; font-size:3rem; z-index:2;">👶</div>
            `;
            setTimeout(() => {
                const star = document.getElementById('star-bethlehem');
                if (star) star.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'batismo':
            content.innerHTML = `
                <div class="river"></div>
                <div class="dove" id="dove">🕊️</div>
                <div class="jesus-in-river interactive-element" id="jesus-river">🙏</div>
                <div style="position:absolute; top:10px; right:20px; font-size:2.5rem;">👨</div>
            `;
            setTimeout(() => {
                const jesus = document.getElementById('jesus-river');
                if (jesus) jesus.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'deserto':
            content.innerHTML = `
                <div class="desert-rock"></div>
                <div class="jesus-in-desert">🙏</div>
                <div class="temptation-choice" id="desert-choice">
                    <div class="food-temptation">🍞</div>
                    <div class="bible-choice interactive-element" id="bible">📖</div>
                </div>
            `;
            setTimeout(() => {
                const bible = document.getElementById('bible');
                if (bible) bible.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'pescadores':
            content.innerHTML = `
                <div class="river" style="height:45%;"></div>
                <div class="boat interactive-element" id="boat">🛶</div>
                <div class="fisherman" style="left:25%;" id="p1">🧑‍🦱</div>
                <div class="fisherman" style="right:25%;" id="p2">🧑</div>
                <div class="fisherman" style="left:40%; bottom:50%;" id="p3">👨</div>
                <div class="fisherman" style="right:40%; bottom:50%;" id="p4">👦</div>
                <div class="fish" style="left:20%;">🐟</div>
                <div class="fish" style="right:20%; animation-delay:1s;">🐠</div>
            `;
            setTimeout(() => {
                ['p1', 'p2', 'p3', 'p4', 'boat'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('click', () => executarAcaoFase(fase));
                });
            }, 100);
            break;

        case 'monte':
            content.innerHTML = `
                <div class="mountain">⛰️</div>
                <div class="jesus-on-mountain">🙏</div>
                <div class="children-group">
                    <div class="child interactive-element" id="c1">🧒</div>
                    <div class="child interactive-element" id="c2">👧</div>
                    <div class="child interactive-element" id="c3">👶</div>
                </div>
                <div class="sun">☀️</div>
            `;
            setTimeout(() => {
                ['c1', 'c2', 'c3'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('click', () => executarAcaoFase(fase));
                });
            }, 100);
            break;

        case 'curaciego':
            content.innerHTML = `
                <div class="village-bg"></div>
                <div class="jesus-healer">🙏</div>
                <div class="blind-man interactive-element" id="blind-man">🧑‍🦯</div>
                <div class="mud" id="mud">🟤</div>
                <div class="healed-eyes" id="healed-eyes">👁️</div>
            `;
            setTimeout(() => {
                const blind = document.getElementById('blind-man');
                if (blind) blind.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'paes':
            content.innerHTML = `
                <div class="grass"></div>
                <div class="crowd">👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦</div>
                <div class="basket interactive-element" id="basket">🧺</div>
                <div class="food-items" id="food-items">
                    <span class="food-item">🍞</span>
                    <span class="food-item">🐟</span>
                </div>
                <div class="jesus-bread">🙏</div>
            `;
            setTimeout(() => {
                const basket = document.getElementById('basket');
                if (basket) basket.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'aguas':
            content.innerHTML = `
                <div class="stormy-sea"></div>
                <div class="boat-storm" id="boat-storm">🛶</div>
                <div class="jesus-walking interactive-element" id="jesus-walking">🙏</div>
                <div class="disciples-scared">😨</div>
                <div class="lightning">⚡</div>
            `;
            setTimeout(() => {
                const jesus = document.getElementById('jesus-walking');
                if (jesus) jesus.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'zaqueu':
            content.innerHTML = `
                <div class="city-bg"></div>
                <div class="tree interactive-element" id="tree">🌳</div>
                <div class="zaqueu" id="zaqueu">🧍</div>
                <div class="jesus-looks-up">🙏</div>
                <div class="house">🏠</div>
            `;
            setTimeout(() => {
                const tree = document.getElementById('tree');
                if (tree) tree.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'jerusalem':
            content.innerHTML = `
                <div class="city-gate"></div>
                <div class="jesus-on-donkey">🙏🐴</div>
                <div class="crowd-cheering">👨‍👩‍👧‍👦👨‍👩‍👧‍👦</div>
                <div class="palms-group">
                    <div class="palm interactive-element" id="palm1">🌿</div>
                    <div class="palm interactive-element" id="palm2">🌿</div>
                    <div class="palm interactive-element" id="palm3">🌿</div>
                    <div class="palm interactive-element" id="palm4">🌿</div>
                </div>
                <div class="hosana-text" id="hosana-text">HOSANA!</div>
            `;
            setTimeout(() => {
                ['palm1', 'palm2', 'palm3', 'palm4'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('click', () => executarAcaoFase(fase));
                });
            }, 100);
            break;

        case 'ceia':
            content.innerHTML = `
                <div class="dinner-room"></div>
                <div class="table">🍽️</div>
                <div class="bread interactive-element" id="last-bread">🍞</div>
                <div class="wine interactive-element" id="last-wine">🍷</div>
                <div class="disciples-table">🧑‍🦱🧑👨👦</div>
                <div class="jesus-at-table">🙏</div>
            `;
            setTimeout(() => {
                const bread = document.getElementById('last-bread');
                const wine = document.getElementById('last-wine');
                if (bread) bread.addEventListener('click', () => executarAcaoFase(fase));
                if (wine) wine.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'cruz':
            content.innerHTML = `
                <div class="calvary-hill"></div>
                <div class="sky-glow"></div>
                <div class="cross-gentle" id="cross-gentle">✝️</div>
                <div class="love-heart interactive-element" id="love-heart">💜</div>
                <div class="angels-comfort">👼👼</div>
                <div class="yoyo-prays" id="yoyo-prays">🧎</div>
            `;
            setTimeout(() => {
                const heart = document.getElementById('love-heart');
                if (heart) heart.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'ressurreicao':
            content.innerHTML = `
                <div class="garden-morning"></div>
                <div class="tomb" id="tomb">⛰️</div>
                <div class="stone interactive-element" id="stone">🪨</div>
                <div class="jesus-risen" id="jesus-risen">🙏</div>
                <div class="sun-rise">🌅</div>
                <div class="angels-tomb">👼👼</div>
            `;
            setTimeout(() => {
                const stone = document.getElementById('stone');
                if (stone) stone.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;
    }
}

// Executar ação da fase
function executarAcaoFase(fase) {
    if (fase.acao === 'clicar-jesus') {
        const dove = document.getElementById('dove');
        if (dove) dove.classList.add('show');
    }

    if (fase.acao === 'clicar-pescadores') {
        document.querySelectorAll('.fisherman').forEach((p, i) => {
            setTimeout(() => {
                p.style.transform = 'scale(1.3) translateY(-20px)';
                p.textContent = '🙋';
            }, i * 200);
        });
    }

    if (fase.acao === 'clicar-criancas') {
        document.querySelectorAll('.child').forEach((c, i) => {
            setTimeout(() => {
                c.style.transform = 'scale(1.2) translateY(-15px)';
                c.textContent = '🤗';
            }, i * 200);
        });
        const sun = document.querySelector('.sun');
        if (sun) sun.style.animation = 'sun-pulse 1s ease-in-out infinite';
    }

    if (fase.acao === 'clicar-cego') {
        const blind = document.getElementById('blind-man');
        const healed = document.getElementById('healed-eyes');
        if (blind) { blind.textContent = '🙋'; blind.style.transform = 'scale(1.2)'; }
        if (healed) { healed.style.opacity = '1'; healed.style.animation = 'eyes-blink 1s ease-in-out infinite'; }
        for (let i = 0; i < 5; i++) setTimeout(() => criarRaioDeLuz(), i * 300);
    }

    if (fase.acao === 'clicar-paes') {
        const basket = document.getElementById('basket');
        const foodContainer = document.getElementById('food-items');
        if (basket) { basket.style.transform = 'scale(1.2)'; basket.textContent = '🧺✨'; }
        if (foodContainer) {
            foodContainer.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const food = document.createElement('span');
                food.className = 'food-item';
                food.textContent = i % 2 === 0 ? '🍞' : '🐟';
                food.style.animationDelay = (i * 0.1) + 's';
                foodContainer.appendChild(food);
            }
            foodContainer.classList.add('food-multiplied');
        }
    }

    if (fase.acao === 'clicar-aguas') {
        const jesus = document.getElementById('jesus-walking');
        const boat = document.getElementById('boat-storm');
        if (jesus) { jesus.style.transition = 'all 2s ease-in-out'; jesus.style.transform = 'translateX(120px) translateY(-20px)'; }
        if (boat) boat.style.animation = 'boat-calm 2s ease-in-out infinite';
        const sea = document.querySelector('.stormy-sea');
        if (sea) sea.classList.add('calm-sea');
    }

    if (fase.acao === 'clicar-arvore') {
        const tree = document.getElementById('tree');
        const zaqueu = document.getElementById('zaqueu');
        if (tree) tree.style.transform = 'rotate(5deg)';
        if (zaqueu) { zaqueu.style.transition = 'all 1s ease-in-out'; zaqueu.style.transform = 'translateY(80px)'; zaqueu.textContent = '🙋'; }
        setTimeout(() => {
            const house = document.querySelector('.house');
            if (house) { house.style.transform = 'scale(1.1)'; house.style.boxShadow = '0 0 30px rgba(255,215,0,0.6)'; }
        }, 1000);
    }

    if (fase.acao === 'clicar-ramos') {
        document.querySelectorAll('.palm').forEach((p, i) => {
            setTimeout(() => { p.style.transform = 'rotate(-20deg) scale(1.3)'; p.style.animation = 'palm-wave 0.5s ease-in-out 3'; }, i * 100);
        });
        const hosana = document.getElementById('hosana-text');
        if (hosana) { hosana.style.opacity = '1'; hosana.style.transform = 'scale(1.5)'; hosana.style.animation = 'hosana-bounce 1s ease-in-out infinite'; }
        const donkey = document.querySelector('.jesus-on-donkey');
        if (donkey) donkey.style.animation = 'donkey-walk 2s ease-in-out forwards';
    }

    if (fase.acao === 'clicar-ceia') {
        const bread = document.getElementById('last-bread');
        const wine = document.getElementById('last-wine');
        if (bread) { bread.style.transform = 'scale(1.2)'; bread.textContent = '🍞✨'; }
        if (wine) { wine.style.transform = 'scale(1.2)'; wine.textContent = '🍷✨'; }
        const table = document.querySelector('.disciples-table');
        if (table) table.style.animation = 'disciples-eat 1s ease-in-out infinite';
    }

    if (fase.acao === 'clicar-coracao') {
        const heart = document.getElementById('love-heart');
        const cross = document.getElementById('cross-gentle');
        if (heart) { heart.style.animation = 'heart-grow 2s ease-in-out infinite'; heart.style.transform = 'scale(1.5)'; }
        if (cross) cross.style.boxShadow = '0 0 50px rgba(255,215,0,0.8)';
        const yoyo = document.getElementById('yoyo-prays');
        if (yoyo) { yoyo.textContent = '🙏'; yoyo.style.animation = 'yoyo-pray 2s ease-in-out infinite'; }
        for (let i = 0; i < 8; i++) setTimeout(() => criarRaioDeLuz(), i * 250);
    }

    if (fase.acao === 'clicar-pedra') {
        const stone = document.getElementById('stone');
        const jesus = document.getElementById('jesus-risen');
        const tomb = document.getElementById('tomb');
        if (stone) { stone.style.transition = 'all 2s ease-in-out'; stone.style.transform = 'translateX(150px) rotate(360deg)'; stone.style.opacity = '0.5'; }
        if (tomb) tomb.style.boxShadow = 'inset 0 0 40px rgba(255,215,0,0.8)';
        if (jesus) { jesus.style.opacity = '1'; jesus.style.transform = 'translateY(-60px) scale(1.2)'; jesus.style.animation = 'jesus-glow 2s ease-in-out infinite'; }
        const sun = document.querySelector('.sun-rise');
        if (sun) sun.style.animation = 'sun-rise-big 3s ease-in-out forwards';
        for (let i = 0; i < 10; i++) setTimeout(() => criarRaioDeLuz(), i * 200);
    }

    ganharEstrela();
    desbloquearMedalha(fase.medalha);
    animarCoracoes();

    if (fase.som) setTimeout(() => falar(fase.som), 500);
    atualizarBotoes(fase, true);
}

// Atualizar botões
function atualizarBotoes(fase, acaoFeita = false) {
    const container = document.getElementById('phase-buttons');
    container.innerHTML = '';

    if (fase.acao === 'escolha' && !acaoFeita) {
        const btn = document.createElement('button');
        btn.className = 'big-btn choice-btn yes';
        btn.innerHTML = '<span class="btn-emoji">📖</span><span class="btn-text">BIBLIA</span>';
        btn.addEventListener('click', () => { falar('Bíblia'); executarAcaoFase(fase); });
        container.appendChild(btn);

        const btnNo = document.createElement('button');
        btnNo.className = 'big-btn choice-btn no';
        btnNo.innerHTML = '<span class="btn-emoji">🍞</span><span class="btn-text">COMIDA</span>';
        btnNo.addEventListener('click', () => {
            falar('Comida');
            document.getElementById('speech-bubble').textContent = 'Yoyo, Jesus escolheu obedecer a Deus, não a comida! Tente de novo! 📖';
            falar('Tente de novo! Escolha a Bíblia!');
        });
        container.appendChild(btnNo);
        return;
    }

    const btn = document.createElement('button');
    btn.className = 'big-btn';
    btn.innerHTML = `<span class="btn-emoji">${acaoFeita ? '▶️' : '✨'}</span><span class="btn-text">${acaoFeita ? 'PRÓXIMO' : 'FAZER'}</span>`;

    if (acaoFeita) {
        btn.addEventListener('click', avancarFase);
    } else {
        btn.addEventListener('click', () => {
            falar('Toque na tela!');
            document.getElementById('phase-instruction').textContent = 'Toque no elemento brilhante!';
        });
    }
    container.appendChild(btn);
}

// Avançar fase
function avancarFase() {
    falar('Próximo');
    if (estado.faseIndex < FASES.length - 1) {
        estado.faseIndex++;
        salvarEstado();
        atualizarTela();
    } else {
        const msg = 'Parabéns, Yoyo! Você completou a jornada de Jesus! Ele nasceu, ensinou, amou, morreu por nós e ressuscitou. Jesus vive e é seu amigo para sempre! ✨🌅';
        falar(msg);
        document.getElementById('speech-bubble').textContent = msg;
        document.getElementById('phase-buttons').innerHTML = `
            <button class="big-btn" onclick="location.reload()">
                <span class="btn-emoji">🔄</span><span class="btn-text">JOGAR DE NOVO</span>
            </button>
        `;
        for (let i = 0; i < 15; i++) setTimeout(() => criarRaioDeLuz(), i * 150);
    }
}

// Estrelas
function ganharEstrela() {
    estado.estrelas++;
    salvarEstado();
}

// Medalhas
function desbloquearMedalha(id) {
    if (!estado.medalhas.includes(id)) {
        estado.medalhas.push(id);
        const medalha = MEDALHAS.find(m => m.id === id);
        if (medalha) setTimeout(() => falar('Nova medalha: ' + medalha.nome), 1000);
        salvarEstado();
        atualizarMedalhas();
    }
}

function atualizarMedalhas() {
    const grid = document.getElementById('medals-grid');
    grid.innerHTML = '';
    MEDALHAS.forEach(m => {
        const desbloqueada = estado.medalhas.includes(m.id);
        const div = document.createElement('div');
        div.className = 'medal' + (desbloqueada ? ' unlocked' : '');
        div.innerHTML = `<span class="medal-emoji">${m.emoji}</span><span class="medal-name">${m.nome}</span>`;
        div.addEventListener('click', () => {
            if (desbloqueada) falar(m.nome + '! Você ganhou!');
            else falar(m.nome);
        });
        grid.appendChild(div);
    });
}

// Progresso
function atualizarProgresso() {
    const container = document.getElementById('story-progress');
    container.innerHTML = '';
    FASES.forEach((f, idx) => {
        const dot = document.createElement('span');
        dot.className = 'story-dot';
        if (idx === estado.faseIndex) dot.classList.add('active');
        if (idx < estado.faseIndex) dot.classList.add('completed');
        dot.textContent = f.emoji;
        dot.addEventListener('click', () => falar(f.titulo));
        container.appendChild(dot);
    });
}

// Efeitos
function animarCoracoes() {
    const container = document.getElementById('scene-card');
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart-pop';
        heart.textContent = ['💖', '💛', '✨'][i];
        heart.style.left = (25 + i * 25) + '%';
        heart.style.top = (20 + Math.random() * 20) + '%';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }
}

function criarRaioDeLuz() {
    const container = document.getElementById('scene-card');
    const ray = document.createElement('div');
    ray.className = 'light-ray';
    ray.style.left = (30 + Math.random() * 40) + '%';
    container.appendChild(ray);
    setTimeout(() => ray.remove(), 2000);
}

// Inicialização
estado = carregarEstado();
criarEstrelas();

document.getElementById('btn-start').addEventListener('click', iniciarJogo);
document.getElementById('btn-home').addEventListener('click', () => {
    mostrarTelaInicial();
});

mostrarTelaInicial();
