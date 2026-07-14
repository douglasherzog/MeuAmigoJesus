// MEU AMIGO JESUS - Jogo completo e independente
// 23 fases interativas da Anunciação à Ascensão
// FASES e MEDALHAS definidas em phases.js
// Renderizadores e interações em interactions.js

var estado = { nome: '', genero: '', faseIndex: 0, estrelas: 0, medalhas: [], fasesCompletas: [] };
var generoSelecionado = '';
var nomeDigitado = '';

// Letras do teclado virtual (layout em linhas)
var TECLAS_LINHAS = [
    ['A','B','C','D','E','F','G'],
    ['H','I','J','K','L','M','N'],
    ['O','P','Q','R','S','T','U'],
    ['V','W','X','Y','Z','Ç','Ã'],
    ['É','Í','Ó','Ú','Â','Ê','Ô']
];

// Nomes falados das letras (para o TTS)
var NOME_LETRAS = {
    'A': 'A', 'B': 'Bê', 'C': 'Cê', 'D': 'Dê', 'E': 'E', 'F': 'Éfe',
    'G': 'Gê', 'H': 'Agá', 'I': 'I', 'J': 'Jóta', 'K': 'Ká', 'L': 'Éle',
    'M': 'Ême', 'N': 'Êne', 'O': 'O', 'P': 'Pê', 'Q': 'Quê',
    'R': 'Érre', 'S': 'Ésse', 'T': 'Tê', 'U': 'U', 'V': 'Vê',
    'W': 'Dáblio', 'X': 'Xis', 'Y': 'Ípsilon', 'Z': 'Zê',
    'Ç': 'Cê-cedilha', 'Ã': 'A com til', 'É': 'E com acento',
    'Í': 'I com acento', 'Ó': 'O com acento', 'Ú': 'U com acento',
    'Â': 'A com circunflexo', 'Ê': 'E com circunflexo', 'Ô': 'O com circunflexo'
};

function carregarEstado() {
    try {
        var salvo = localStorage.getItem('meuamigojesus-save');
        if (salvo) {
            var e = JSON.parse(salvo);
            if (!e.versiculosMemorizados) e.versiculosMemorizados = [];
            if (!e.conquistasExtras) e.conquistasExtras = [];
            if (!e.diasJogados) e.diasJogados = [];
            return e;
        }
    } catch (e) { console.log('Erro ao carregar', e); }
    return { nome: '', genero: '', faseIndex: 0, estrelas: 0, medalhas: [], fasesCompletas: [], versiculosMemorizados: [], conquistasExtras: [], diasJogados: [] };
}

function salvarEstado() {
    localStorage.setItem('meuamigojesus-save', JSON.stringify(estado));
}

function criarEstrelas() {
    var bg = document.getElementById('stars-bg');
    if (!bg) return;
    for (var i = 0; i < 60; i++) {
        var star = document.createElement('div');
        star.className = 'star-dot';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        bg.appendChild(star);
    }
}

// ============================================
// ADAPTAR GÊNERO - ajusta textos conforme menino/menina
// ============================================
function adaptarGenero(texto) {
    if (!texto) return texto;
    if (estado.genero === 'feminino') {
        texto = texto.replace(/meu pequeno amigo/g, 'minha pequena amiga');
        texto = texto.replace(/meu pequeno/g, 'minha pequena');
        texto = texto.replace(/meu amigo/g, 'minha amiga');
        texto = texto.replace(/amigo de Jesus/g, 'amiga de Jesus');
        texto = texto.replace(/amigo(a)/g, 'amiga');
        texto = texto.replace(/Bem-vindo(a)/g, 'Bem-vinda');
        texto = texto.replace(/é amigo/g, 'é amiga');
        texto = texto.replace(/amigo para sempre/g, 'amiga para sempre');
        texto = texto.replace(/sou amigo/g, 'sou amiga');
        texto = texto.replace(/amigo!/g, 'amiga!');
    } else {
        texto = texto.replace(/amigo(a)/g, 'amigo');
        texto = texto.replace(/Bem-vindo(a)/g, 'Bem-vindo');
    }
    return texto;
}

// ============================================
// TELA DE NOME - TECLADO VIRTUAL
// ============================================
function mostrarTelaNome() {
    document.getElementById('name-screen').style.display = 'block';
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    nomeDigitado = '';
    generoSelecionado = '';
    atualizarNameDisplay();
    criarTecladoVirtual();
    var btnBoy = document.getElementById('gender-boy');
    var btnGirl = document.getElementById('gender-girl');
    if (btnBoy) btnBoy.classList.remove('selected');
    if (btnGirl) btnGirl.classList.remove('selected');
    var genderMsg = document.querySelector('.gender-msg');
    if (genderMsg) genderMsg.classList.remove('error');
}

function criarTecladoVirtual() {
    var kb = document.getElementById('virtual-keyboard');
    if (!kb) return;
    kb.innerHTML = '';
    TECLAS_LINHAS.forEach(function(linha) {
        var row = document.createElement('div');
        row.className = 'kb-row';
        linha.forEach(function(letra) {
            var btn = document.createElement('button');
            btn.className = 'kb-key';
            btn.type = 'button';
            btn.textContent = letra;
            btn.addEventListener('click', function() { adicionarLetra(letra); });
            row.appendChild(btn);
        });
        kb.appendChild(row);
    });
}

function adicionarLetra(letra) {
    if (nomeDigitado.length >= 20) return;
    nomeDigitado += letra;
    atualizarNameDisplay();
    // Toca o som da letra
    var nomeLetra = NOME_LETRAS[letra] || letra;
    falar(nomeLetra);
}

function apagarLetra() {
    if (nomeDigitado.length === 0) return;
    nomeDigitado = nomeDigitado.slice(0, -1);
    atualizarNameDisplay();
    falar('Apagou!');
}

function limparNome() {
    nomeDigitado = '';
    atualizarNameDisplay();
    falar('Limpou!');
}

function atualizarNameDisplay() {
    var display = document.getElementById('name-display');
    if (!display) return;
    if (nomeDigitado.length === 0) {
        display.innerHTML = '<span class="name-placeholder">Toque nas letras!</span>';
    } else {
        display.textContent = nomeDigitado;
    }
}

function selecionarGenero(genero) {
    generoSelecionado = genero;
    var btnBoy = document.getElementById('gender-boy');
    var btnGirl = document.getElementById('gender-girl');
    if (btnBoy) btnBoy.classList.toggle('selected', genero === 'masculino');
    if (btnGirl) btnGirl.classList.toggle('selected', genero === 'feminino');
    var genderMsg = document.querySelector('.gender-msg');
    if (genderMsg) genderMsg.classList.remove('error');
    if (genero === 'masculino') falar('Menino!');
    else if (genero === 'feminino') falar('Menina!');
}

function confirmarNome() {
    if (!nomeDigitado) {
        falar('Toque nas letras para escrever seu nome!');
        var display = document.getElementById('name-display');
        if (display) {
            display.classList.add('error');
            setTimeout(function() { display.classList.remove('error'); }, 600);
        }
        return;
    }
    if (!generoSelecionado) {
        falar('Você é menino ou menina? Escolha uma figura!');
        var genderMsg = document.querySelector('.gender-msg');
        if (genderMsg) genderMsg.classList.add('error');
        return;
    }
    estado.nome = nomeDigitado;
    estado.genero = generoSelecionado;
    salvarEstado();
    var saudacao = estado.genero === 'feminino'
        ? 'Olá ' + estado.nome + ', amiga de Jesus! Vamos começar nossa aventura!'
        : 'Olá ' + estado.nome + ', amigo de Jesus! Vamos começar nossa aventura!';
    falar(saudacao);
    mostrarTelaInicial();
}

// ============================================
// TELA INICIAL
// ============================================
function mostrarTelaInicial() {
    document.getElementById('name-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';

    var welcomeEl = document.getElementById('welcome-name');
    if (welcomeEl && estado.nome) {
        var bemVindo = estado.genero === 'feminino' ? 'Bem-vinda' : 'Bem-vindo';
        var amigo = estado.genero === 'feminino' ? 'amiga' : 'amigo';
        welcomeEl.textContent = bemVindo + ', ' + estado.nome + '! Você é ' + amigo + ' de Jesus!';
        welcomeEl.style.display = 'block';
    }

    var medalsDiv = document.getElementById('start-medals');
    if (medalsDiv) {
        medalsDiv.innerHTML = '';
        MEDALHAS.forEach(function(m) {
            var span = document.createElement('span');
            span.className = 'start-medal' + (estado.medalhas.includes(m.id) ? ' unlocked' : '');
            span.textContent = m.emoji;
            span.title = m.nome;
            medalsDiv.appendChild(span);
        });
    }

    var continueBtn = document.getElementById('btn-continue');
    if (continueBtn) {
        continueBtn.style.display = (estado.faseIndex > 0 || estado.medalhas.length > 0) ? 'inline-flex' : 'none';
    }

    var reviewBtn = document.getElementById('btn-review');
    if (reviewBtn) {
        reviewBtn.style.display = (estado.fasesCompletas.length > 0) ? 'inline-flex' : 'none';
    }

    atualizarConquistasExtrasUI();
}

// ============================================
// TELA DE REVISÃO
// ============================================
function mostrarTelaRevisao() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'block';

    var intro = document.getElementById('review-intro');
    if (intro && estado.nome) {
        intro.textContent = estado.nome + ', vamos lembrar o que aprendemos! Escolha uma fase para revisar:';
    }

    var container = document.getElementById('review-phases');
    if (!container) return;
    container.innerHTML = '';

    FASES.forEach(function(fase) {
        if (!estado.fasesCompletas.includes(fase.id)) return;
        var div = document.createElement('div');
        div.className = 'review-phase-card';
        var memorizado = estado.versiculosMemorizados && estado.versiculosMemorizados.includes(fase.id);
        div.innerHTML = ''
            + '<div class="review-phase-emoji">' + fase.emoji + '</div>'
            + '<div class="review-phase-title">Fase ' + fase.numero + ': ' + fase.titulo + '</div>'
            + '<div class="review-phase-status">' + (memorizado ? '✅ Versículo memorizado' : '⭐ Versículo pendente') + '</div>'
            + '<button class="review-phase-btn" id="review-' + fase.id + '">📝 REVISAR</button>';
        container.appendChild(div);
        document.getElementById('review-' + fase.id).addEventListener('click', function() {
            iniciarRevisaoFase(fase);
        });
    });
}

function iniciarRevisaoFase(fase) {
    document.getElementById('review-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    document.getElementById('phase-badge').textContent = 'REVISÃO - FASE ' + fase.numero;
    document.getElementById('stars-count').textContent = estado.estrelas;
    document.getElementById('phase-emoji').textContent = fase.emoji;
    document.getElementById('phase-title').textContent = fase.titulo;
    document.getElementById('phase-instruction').textContent = 'Vamos recordar o que aprendemos!';

    var fala = 'Vamos recordar, ' + (estado.nome || '') + '! ' + fase.fala.replace(/\{nome\}/g, estado.nome || '');
    fala = adaptarGenero(fala);
    document.getElementById('speech-bubble').textContent = fala;
    falar(fala);

    var licaoEl = document.getElementById('lesson-area');
    if (licaoEl) licaoEl.style.display = 'none';

    renderizarCenario(fase);
    if (typeof tocarEfeitoFase === 'function') tocarEfeitoFase(fase.cenario);
    atualizarProgresso();
    atualizarMedalhas();

    var container = document.getElementById('phase-buttons');
    container.innerHTML = '';

    var btnQuiz = document.createElement('button');
    btnQuiz.className = 'big-btn quiz-btn';
    btnQuiz.innerHTML = '<span class="btn-emoji">❓</span><span class="btn-text">QUIZ DE REVISÃO</span>';
    btnQuiz.addEventListener('click', function() { mostrarQuizRevisao(fase); });
    container.appendChild(btnQuiz);

    var btnVerse = document.createElement('button');
    btnVerse.className = 'big-btn hint-btn';
    btnVerse.innerHTML = '<span class="btn-emoji">📖</span><span class="btn-text">VER VERSÍCULO</span>';
    btnVerse.addEventListener('click', function() { mostrarLicao(fase); });
    container.appendChild(btnVerse);

    var btnBack = document.createElement('button');
    btnBack.className = 'big-btn restart-btn';
    btnBack.innerHTML = '<span class="btn-emoji">📚</span><span class="btn-text">VOLTAR</span>';
    btnBack.addEventListener('click', function() {
        document.getElementById('game-screen').style.display = 'none';
        mostrarTelaRevisao();
    });
    container.appendChild(btnBack);
}

function mostrarQuizRevisao(fase) {
    var container = document.getElementById('phase-buttons');
    container.innerHTML = '';

    var perguntas = gerarPerguntasRevisao(fase);
    var perguntaIdx = 0;
    var acertos = 0;

    function mostrarPergunta() {
        if (perguntaIdx >= perguntas.length) {
            container.innerHTML = ''
                + '<div class="quiz-result">'
                +   '<div class="quiz-result-score">' + acertos + ' de ' + perguntas.length + ' corretas!</div>'
                +   '<div class="quiz-result-msg">' + (acertos === perguntas.length ? '🌟 Perfeito! Você lembrou de tudo!' : '👍 Muito bem! Continue praticando!') + '</div>'
                + '</div>';
            if (acertos === perguntas.length) {
                soltarConfete(30);
                guideCelebrar((estado.nome || '') + ', voce acertou tudo! Que maravilha!');
            }
            falar(acertos + ' de ' + perguntas.length + ' corretas!');
            var btnBack = document.createElement('button');
            btnBack.className = 'big-btn restart-btn';
            btnBack.innerHTML = '<span class="btn-emoji">📚</span><span class="btn-text">VOLTAR</span>';
            btnBack.addEventListener('click', function() {
                document.getElementById('game-screen').style.display = 'none';
                mostrarTelaRevisao();
            });
            container.appendChild(btnBack);
            return;
        }

        var p = perguntas[perguntaIdx];
        container.innerHTML = ''
            + '<div class="quiz-review-box">'
            +   '<div class="quiz-review-question">' + (perguntaIdx + 1) + '. ' + p.pergunta + '</div>'
            +   '<div class="quiz-review-options" id="quiz-review-options"></div>'
            + '</div>';

        var optsContainer = document.getElementById('quiz-review-options');
        p.opcoes.forEach(function(opt, i) {
            var btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', function() {
                var allBtns = optsContainer.querySelectorAll('.quiz-option-btn');
                allBtns.forEach(function(b) { b.disabled = true; });
                if (i === p.correta) {
                    btn.classList.add('correct');
                    acertos++;
                    falar('Correto!');
                } else {
                    btn.classList.add('wrong');
                    allBtns[p.correta].classList.add('correct');
                    falar('A resposta certa e: ' + p.opcoes[p.correta]);
                }
                setTimeout(function() {
                    perguntaIdx++;
                    mostrarPergunta();
                }, 1800);
            });
            optsContainer.appendChild(btn);
        });

        falar(p.pergunta);
    }

    mostrarPergunta();
}

function gerarPerguntasRevisao(fase) {
    var todas = [
        {
            pergunta: 'O que aprendemos na fase "' + fase.titulo + '"?',
            opcoes: [fase.licao, 'Jesus nao nos ama', 'Nao precisamos orar', 'Deus nao nos ouve'],
            correta: 0
        },
        {
            pergunta: 'Qual e o versiculo da fase "' + fase.titulo + '"?',
            opcoes: [fase.versiculo, 'Joao 3:16 - "Porque Deus amou o mundo"', 'Genesis 1:1 - "No principio criou Deus"', 'Salmos 23:1 - "O Senhor e meu pastor"'],
            correta: 0
        },
        {
            pergunta: 'Qual e a oracao que aprendemos?',
            opcoes: ['Pai nosso que estais nos ceus', fase.oracao, 'Ave Maria cheia de graca', 'Gloria ao Pai ao Filho e ao Espirito Santo'],
            correta: 1
        },
        {
            pergunta: 'Qual emoji representa a fase "' + fase.titulo + '"?',
            opcoes: [fase.emoji, '🦁', '🚀', '🎮'],
            correta: 0
        }
    ];
    return todas;
}

// ============================================
// INICIAR JOGO
// ============================================
function iniciarJogo(reiniciar) {
    if (reiniciar) {
        estado.faseIndex = 0;
        estado.estrelas = 0;
        estado.medalhas = [];
        estado.fasesCompletas = [];
        salvarEstado();
    }
    if (!estado.nome || !estado.genero) {
        mostrarTelaNome();
        return;
    }
    falar(estado.nome + ', vamos aprender com Jesus!');
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    registrarDiaJogado();
    atualizarTela();
}

// ============================================
// ATUALIZAR TELA
// ============================================
function atualizarTela() {
    var fase = FASES[estado.faseIndex];
    if (!fase) return;

    document.getElementById('phase-badge').textContent = 'FASE ' + fase.numero + ' DE ' + FASES.length;
    document.getElementById('stars-count').textContent = estado.estrelas;
    document.getElementById('phase-emoji').textContent = fase.emoji;
    document.getElementById('phase-title').textContent = fase.titulo;
    var instrucao = fase.instrucao;
    if (estado.nome) {
        instrucao = instrucao.replace(/\{nome\}/g, estado.nome);
    }
    document.getElementById('phase-instruction').textContent = adaptarGenero(instrucao);

    var fala = fase.fala;
    if (estado.nome) {
        fala = fala.replace(/\{nome\}/g, estado.nome);
    }
    fala = adaptarGenero(fala);
    document.getElementById('speech-bubble').textContent = fala;
    falar(fala);

    var licaoEl = document.getElementById('lesson-area');
    if (licaoEl) licaoEl.style.display = 'none';

    renderizarCenario(fase);
    if (typeof tocarEfeitoFase === 'function') tocarEfeitoFase(fase.cenario);
    guideDicaFase(fase);
    atualizarBotoes(fase);
    atualizarProgresso();
    atualizarMedalhas();
}

// renderizarCenario e executarInteracao estão em interactions.js

// ============================================
// MOSTRAR LIÇÃO após completar interação
// ============================================
function mostrarLicao(fase) {
    var licaoEl = document.getElementById('lesson-area');
    if (!licaoEl) return;
    licaoEl.style.display = 'block';
    var licao = fase.licao;
    if (estado.nome) {
        licao = licao.replace(/\{nome\}/g, estado.nome);
    }
    licao = adaptarGenero(licao);
    var oracao = fase.oracao || '';
    if (estado.nome) {
        oracao = oracao.replace(/\{nome\}/g, estado.nome);
    }
    oracao = adaptarGenero(oracao);
    var versiculo = fase.versiculo || '';
    var memorizado = estado.versiculosMemorizados && estado.versiculosMemorizados.includes(fase.id);
    var nome = estado.nome || '';
    licaoEl.innerHTML = ''
        + '<div class="lesson-card">'
        +   '<div class="lesson-versiculo">📖 ' + versiculo + '</div>'
        +   '<div class="lesson-licao">💡 ' + licao + '</div>'
        +   '<button class="prayer-btn" id="btn-prayer" type="button">'
        +     '<span class="btn-emoji">🙏</span><span class="btn-text">REZAR JUNTO</span>'
        +   '</button>'
        +   '<div class="prayer-text" id="prayer-text" style="display:none;">' + oracao + '</div>'
        +   '<div class="verse-challenge" id="verse-challenge">'
        +     '<div class="verse-challenge-title">⭐ DESAFIO DA SEMANA ⭐</div>'
        +     '<div class="verse-challenge-text" id="verse-challenge-text">' + versiculo + '</div>'
        +     '<div class="verse-challenge-buttons">'
        +       '<button class="verse-repeat-btn" id="btn-verse-repeat" type="button">🔊 OUVIR DE NOVO</button>'
        +       '<button class="verse-memorized-btn' + (memorizado ? ' done' : '') + '" id="btn-verse-memorized" type="button">'
        +         (memorizado ? '✅ MEMORIZADO!' : '🧠 JÁ MEMORIZEI!')
        +       '</button>'
        +     '</div>'
        +     '<div class="verse-count" id="verse-count"></div>'
        +   '</div>'
        + '</div>';
    falar(licao);
    var btnPrayer = document.getElementById('btn-prayer');
    if (btnPrayer) btnPrayer.addEventListener('click', function() {
        var prayerEl = document.getElementById('prayer-text');
        if (prayerEl) {
            prayerEl.style.display = 'block';
            prayerEl.classList.add('prayer-appear');
        }
        falar(oracao);
        soltarConfete(10);
        if (!estado.conquistasExtras.includes('primeira_oracao')) {
            estado.conquistasExtras.push('primeira_oracao');
            salvarEstado();
            mostrarNotificacaoConquista(CONQUISTAS_EXTRAS.find(function(c) { return c.id === 'primeira_oracao'; }));
        }
    });
    var btnRepeat = document.getElementById('btn-verse-repeat');
    if (btnRepeat) btnRepeat.addEventListener('click', function() {
        falar(versiculo);
        var vText = document.getElementById('verse-challenge-text');
        if (vText) {
            vText.classList.remove('verse-highlight');
            void vText.offsetWidth;
            vText.classList.add('verse-highlight');
        }
    });
    var btnMemorized = document.getElementById('btn-verse-memorized');
    if (btnMemorized) btnMemorized.addEventListener('click', function() {
        if (!estado.versiculosMemorizados) estado.versiculosMemorizados = [];
        if (!estado.versiculosMemorizados.includes(fase.id)) {
            estado.versiculosMemorizados.push(fase.id);
            salvarEstado();
        }
        btnMemorized.textContent = '✅ MEMORIZADO!';
        btnMemorized.classList.add('done');
        soltarConfete(25);
        guideCelebrar(nome + ', voce memorizou o versiculo! Que beleza!');
        falar('Parabens, ' + nome + '! Voce memorizou o versiculo da semana!');
        atualizarContadorVersiculos();
        verificarConquistas();
    });
    atualizarContadorVersiculos();
}

function atualizarContadorVersiculos() {
    var el = document.getElementById('verse-count');
    if (!el) return;
    var total = estado.versiculosMemorizados ? estado.versiculosMemorizados.length : 0;
    el.textContent = 'Versiculos memorizados: ' + total + ' de ' + FASES.length;
}

// ============================================
// BOTÕES DE CONCLUSÃO
// ============================================
function atualizarBotoesConclusao(fase) {
    ganharEstrela();
    desbloquearMedalha(fase.medalha);
    marcarFaseCompleta(fase.id);

    var nome = estado.nome || '';
    var amigo = estado.genero === 'feminino' ? 'amiga' : 'amigo';
    setTimeout(function() {
        guideCelebrar('Muito bem, ' + nome + '! Voce e um(a) ' + amigo + ' especial!');
    }, 1500);

    var container = document.getElementById('phase-buttons');
    container.innerHTML = '';

    var btn = document.createElement('button');
    btn.className = 'big-btn next-btn';
    btn.innerHTML = '<span class="btn-emoji">▶️</span><span class="btn-text">PRÓXIMO</span>';
    btn.addEventListener('click', avancarFase);
    container.appendChild(btn);
}

// ============================================
// BOTÕES DA FASE
// ============================================
function atualizarBotoes(fase) {
    var container = document.getElementById('phase-buttons');
    container.innerHTML = '';

    var hint = document.createElement('button');
    hint.className = 'big-btn hint-btn';
    hint.innerHTML = '<span class="btn-emoji">💡</span><span class="btn-text">AJUDA</span>';
    hint.addEventListener('click', function() {
        var inst = fase.instrucao;
        if (estado.nome) {
            inst = inst.replace(/\{nome\}/g, estado.nome);
        }
        inst = adaptarGenero(inst);
        falar(inst);
    });
    container.appendChild(hint);
}

// ============================================
// AVANÇAR FASE
// ============================================
function avancarFase() {
    if (estado.faseIndex < FASES.length - 1) {
        estado.faseIndex++;
        salvarEstado();
        atualizarTela();
    } else {
        mostrarTelaFinal();
    }
}

// ============================================
// TELA FINAL
// ============================================
function mostrarTelaFinal() {
    var nome = estado.nome || 'amigo(a)';
    var amigo = estado.genero === 'feminino' ? 'amiga' : 'amigo';
    var msg = 'Parabéns, ' + nome + '! Você acompanhou toda a jornada de Jesus! '
        + 'Ele nasceu, cresceu, ensinou, amou, curou, morreu por nós e ressuscitou! '
        + 'Subiu ao céu e enviou o Espírito Santo, o Consolador, em Pentecostes! '
        + 'O Espírito de Jesus vive no seu coração, ' + nome + '! Jesus é seu ' + amigo + ' para sempre! ✨🌅💜';
    falar(msg);
    document.getElementById('speech-bubble').textContent = msg;

    document.getElementById('phase-emoji').textContent = '🏆';
    document.getElementById('phase-title').textContent = 'JORNADA COMPLETA!';
    document.getElementById('phase-instruction').textContent = nome + ', você conquistou todas as medalhas!';

    document.getElementById('phase-buttons').innerHTML = ''
        + '<button class="big-btn restart-btn" id="btn-restart">'
        +   '<span class="btn-emoji">🔄</span><span class="btn-text">JOGAR DE NOVO</span>'
        + '</button>'
        + '<button class="big-btn certificate-btn" id="btn-certificate">'
        +   '<span class="btn-emoji">📜</span><span class="btn-text">MEU CERTIFICADO</span>'
        + '</button>';

    document.getElementById('btn-restart').addEventListener('click', function() {
        iniciarJogo(true);
    });

    document.getElementById('btn-certificate').addEventListener('click', function() {
        gerarCertificado();
    });

    for (var i = 0; i < 20; i++) setTimeout(criarRaioDeLuz, i * 150);
    verificarConquistas();
}

// ============================================
// CERTIFICADO
// ============================================
function gerarCertificado() {
    var nome = estado.nome || 'Amigo(a)';
    var amigo = estado.genero === 'feminino' ? 'amiga' : 'amigo';
    var data = new Date();
    var dataFormatada = data.toLocaleDateString('pt-BR');
    var totalMedalhas = estado.medalhas.length;
    var totalVersiculos = estado.versiculosMemorizados ? estado.versiculosMemorizados.length : 0;
    var totalEstrelas = estado.estrelas;

    var overlay = document.createElement('div');
    overlay.id = 'certificate-overlay';
    overlay.className = 'certificate-overlay';

    overlay.innerHTML = ''
        + '<div class="certificate-modal">'
        +   '<div class="certificate-paper">'
        +     '<div class="certificate-border">'
        +       '<div class="certificate-emoji">✝️</div>'
        +       '<h2 class="certificate-title">CERTIFICADO</h2>'
        +       '<p class="certificate-subtitle">de Amigo(a) de Jesus</p>'
        +       '<div class="certificate-divider"></div>'
        +       '<p class="certificate-body">Este certificado é concedido com muito amor a</p>'
        +       '<p class="certificate-name">' + nome + '</p>'
        +       '<p class="certificate-body">por acompanhar toda a jornada de Jesus, do nascimento ao céu, '
        +         'e receber o Espírito Santo em Pentecostes, com dedicação, fé e alegria. '
        +         'Você é uma ' + (estado.genero === 'feminino' ? 'amiga' : 'amigo') + ' especial de Jesus!</p>'
        +       '<div class="certificate-stats">'
        +         '<div class="cert-stat"><span class="cert-stat-num">' + totalEstrelas + '</span><span class="cert-stat-label">⭐ Estrelas</span></div>'
        +         '<div class="cert-stat"><span class="cert-stat-num">' + totalMedalhas + '</span><span class="cert-stat-label">🏆 Medalhas</span></div>'
        +         '<div class="cert-stat"><span class="cert-stat-num">' + totalVersiculos + '</span><span class="cert-stat-label">📖 Versículos</span></div>'
        +       '</div>'
        +       '<p class="certificate-verse">"Eu estarei com você todos os dias, até o fim dos tempos." - Mateus 28:20</p>'
        +       '<div class="certificate-signature">'
        +         '<div class="cert-sign-line"></div>'
        +         '<p class="cert-sign-text">Jesus, seu amigo para sempre 💜</p>'
        +       '</div>'
        +       '<p class="certificate-date">' + dataFormatada + '</p>'
        +     '</div>'
        +   '</div>'
        +   '<div class="certificate-buttons">'
        +     '<button class="cert-btn-print" id="btn-cert-print">🖨️ IMPRIMIR</button>'
        +     '<button class="cert-btn-close" id="btn-cert-close">✖ FECHAR</button>'
        +   '</div>'
        + '</div>';

    document.body.appendChild(overlay);

    document.getElementById('btn-cert-print').addEventListener('click', function() {
        window.print();
    });
    document.getElementById('btn-cert-close').addEventListener('click', function() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });

    falar(nome + ', aqui esta o seu certificado de ' + amigo + ' de Jesus! Voce completou toda a jornada!');
    soltarConfete(50);
}

// ============================================
// CORDEIRINHO GUIA
// ============================================
var guideTimer = null;

function guideFalar(texto, duracao) {
    var bubble = document.getElementById('guide-bubble');
    if (!bubble) return;
    bubble.textContent = texto;
    bubble.classList.remove('celebrate');
    bubble.classList.add('show');
    if (guideTimer) clearTimeout(guideTimer);
    guideTimer = setTimeout(function() {
        bubble.classList.remove('show');
    }, duracao || 4000);
}

function guideCelebrar(texto) {
    var lamb = document.getElementById('guide-lamb');
    var bubble = document.getElementById('guide-bubble');
    if (!lamb || !bubble) return;
    bubble.textContent = texto;
    bubble.classList.add('show', 'celebrate');
    lamb.classList.add('celebrating');
    if (guideTimer) clearTimeout(guideTimer);
    guideTimer = setTimeout(function() {
        bubble.classList.remove('show', 'celebrate');
        lamb.classList.remove('celebrating');
    }, 4000);
}

function guideEsconder() {
    var bubble = document.getElementById('guide-bubble');
    if (bubble) bubble.classList.remove('show');
    if (guideTimer) clearTimeout(guideTimer);
}

// Dicas do cordeirinho por tipo de interacao
function guideDicaFase(fase) {
    var dicas = {
        'clicar': 'Toque na figura brilhante!',
        'encontrar': 'Procure as figuras escondidas. Toque quando achar!',
        'sequencia': 'Toque nas figuras na ordem certa!',
        'clicar-multi': 'Toque em todas as figuras!',
        'quiz': 'Escolha a resposta certa. Pense bem!',
        'escolha': 'Escolha a opcao certa!',
        'arrastar': 'Arraste as figuras ate o destino!',
        'completar': 'Escolha a palavra que completa a frase!',
        'contar': 'Conte com cuidado e escolha a resposta!',
        'orar': 'Toque em cada gota para orar com Jesus!'
    };
    var dica = dicas[fase.interacao];
    if (dica) {
        var nome = estado.nome || '';
        setTimeout(function() { guideFalar(nome + ', ' + dica, 5000); }, 2000);
    }
}

// ============================================
// CONFETE - Animação de recompensa
// ============================================
var CONFETE_CORES = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2'];

function soltarConfete(quantidade) {
    var container = document.getElementById('confete-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'confete-container';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
        document.body.appendChild(container);
    }
    for (var i = 0; i < quantidade; i++) {
        var p = document.createElement('div');
        p.className = 'confete-piece';
        var cor = CONFETE_CORES[Math.floor(Math.random() * CONFETE_CORES.length)];
        var tamanho = 6 + Math.random() * 8;
        var xStart = Math.random() * 100;
        var duracao = 1.5 + Math.random() * 1.5;
        var atraso = Math.random() * 0.5;
        var rotacao = Math.random() * 360;
        var forma = Math.random() > 0.5 ? '50%' : '2px';
        p.style.cssText = 'position:absolute;width:' + tamanho + 'px;height:' + tamanho + 'px;'
            + 'background:' + cor + ';'
            + 'left:' + xStart + '%;top:-20px;'
            + 'border-radius:' + forma + ';'
            + 'animation:confete-cair ' + duracao + 's ease-in ' + atraso + 's forwards;'
            + 'transform:rotate(' + rotacao + 'deg);';
        container.appendChild(p);
        (function(piece, tempo) {
            setTimeout(function() { if (piece.parentNode) piece.parentNode.removeChild(piece); }, (tempo + atraso) * 1000 + 200);
        })(p, duracao);
    }
}

// ============================================
// TAMANHO DE FONTE AJUSTAVEL
// ============================================
var FONTE_PADRAO = 16;
var FONTE_MIN = 12;
var FONTE_MAX = 28;
var FONTE_STEP = 2;

function carregarFonte() {
    try {
        var tam = localStorage.getItem('meuamigojesus-fontsize');
        if (tam) {
            var n = parseInt(tam);
            if (n >= FONTE_MIN && n <= FONTE_MAX) return n;
        }
    } catch (e) {}
    return FONTE_PADRAO;
}

function salvarFonte(tam) {
    try { localStorage.setItem('meuamigojesus-fontsize', String(tam)); } catch (e) {}
}

function aplicarFonte(tam) {
    document.documentElement.style.fontSize = tam + 'px';
    var btnDec = document.getElementById('btn-font-decrease');
    var btnInc = document.getElementById('btn-font-increase');
    if (btnDec) btnDec.disabled = (tam <= FONTE_MIN);
    if (btnInc) btnInc.disabled = (tam >= FONTE_MAX);
}

function aumentarFonte() {
    var tam = carregarFonte() + FONTE_STEP;
    if (tam > FONTE_MAX) tam = FONTE_MAX;
    salvarFonte(tam);
    aplicarFonte(tam);
    falar('Fonte maior');
}

function diminuirFonte() {
    var tam = carregarFonte() - FONTE_STEP;
    if (tam < FONTE_MIN) tam = FONTE_MIN;
    salvarFonte(tam);
    aplicarFonte(tam);
    falar('Fonte menor');
}

// ============================================
// ALTO CONTRASTE
// ============================================
function carregarContraste() {
    try {
        return localStorage.getItem('meuamigojesus-contrast') === 'true';
    } catch (e) {}
    return false;
}

function salvarContraste(ativo) {
    try { localStorage.setItem('meuamigojesus-contrast', ativo ? 'true' : 'false'); } catch (e) {}
}

function aplicarContraste(ativo) {
    document.body.classList.toggle('high-contrast', ativo);
    var btn = document.getElementById('btn-contrast');
    if (btn) {
        btn.textContent = ativo ? '☀️' : '🌓';
        btn.classList.toggle('contrast-on', ativo);
    }
}

function alternarContraste() {
    var ativo = !carregarContraste();
    salvarContraste(ativo);
    aplicarContraste(ativo);
    falar(ativo ? 'Alto contraste ligado' : 'Alto contraste desligado');
}

// ============================================
// CONQUISTAS EXTRAS - Badges especiais
// ============================================
var CONQUISTAS_EXTRAS = [
    { id: 'primeira_estrela', nome: 'PRIMEIRA ESTRELA', emoji: '⭐', desc: 'Ganhou sua primeira estrela!' },
    { id: 'cinco_estrelas', nome: 'CINCO ESTRELAS', emoji: '🌟', desc: 'Juntou 5 estrelas!' },
    { id: 'dez_estrelas', nome: 'DEZ ESTRELAS', emoji: '💫', desc: 'Juntou 10 estrelas!' },
    { id: 'todas_estrelas', nome: 'CEU ESTRELADO', emoji: '✨', desc: 'Conquistou todas as 28 estrelas!' },
    { id: 'primeira_medalha', nome: 'PRIMEIRA MEDALHA', emoji: '🥇', desc: 'Ganhou sua primeira medalha!' },
    { id: 'metade_medalhas', nome: 'METADE DO CAMINHO', emoji: '🎖️', desc: 'Conquistou 14 medalhas!' },
    { id: 'todas_medalhas', nome: 'CAMPEAO DE JESUS', emoji: '🏆', desc: 'Conquistou todas as 28 medalhas!' },
    { id: 'primeiro_versiculo', nome: 'PRIMEIRO VERSICULO', emoji: '📖', desc: 'Memorizou seu primeiro versiculo!' },
    { id: 'cinco_versiculos', nome: 'GUARDIAO DA PALAVRA', emoji: '📚', desc: 'Memorizou 5 versiculos!' },
    { id: 'todos_versiculos', nome: 'CORACAO CHEIO', emoji: '💜', desc: 'Memorizou todos os 28 versiculos!' },
    { id: 'primeira_oracao', nome: 'CRIANCA QUE ORA', emoji: '🙏', desc: 'Fez sua primeira oracao!' },
    { id: 'tres_dias', nome: 'AMIGO FIEL', emoji: '🔥', desc: 'Jogou 3 dias seguidos!' },
    { id: 'sete_dias', nome: 'DISCIPULO DEDICADO', emoji: '💎', desc: 'Jogou 7 dias seguidos!' },
    { id: 'jornada_completa', nome: 'AMIGO DE JESUS', emoji: '✝️', desc: 'Completou toda a jornada de Jesus!' }
];

function verificarConquistas() {
    var novas = [];
    CONQUISTAS_EXTRAS.forEach(function(c) {
        if (estado.conquistasExtras.includes(c.id)) return;
        var ganhou = false;
        switch (c.id) {
            case 'primeira_estrela': ganhou = estado.estrelas >= 1; break;
            case 'cinco_estrelas': ganhou = estado.estrelas >= 5; break;
            case 'dez_estrelas': ganhou = estado.estrelas >= 10; break;
            case 'todas_estrelas': ganhou = estado.estrelas >= FASES.length; break;
            case 'primeira_medalha': ganhou = estado.medalhas.length >= 1; break;
            case 'metade_medalhas': ganhou = estado.medalhas.length >= 14; break;
            case 'todas_medalhas': ganhou = estado.medalhas.length >= FASES.length; break;
            case 'primeiro_versiculo': ganhou = estado.versiculosMemorizados.length >= 1; break;
            case 'cinco_versiculos': ganhou = estado.versiculosMemorizados.length >= 5; break;
            case 'todos_versiculos': ganhou = estado.versiculosMemorizados.length >= FASES.length; break;
            case 'jornada_completa': ganhou = estado.fasesCompletas.length >= FASES.length; break;
        }
        if (ganhou) {
            estado.conquistasExtras.push(c.id);
            novas.push(c);
        }
    });
    if (novas.length > 0) {
        salvarEstado();
        novas.forEach(function(c, i) {
            setTimeout(function() {
                mostrarNotificacaoConquista(c);
            }, i * 2000 + 500);
        });
        atualizarMedalhas();
    }
}

function mostrarNotificacaoConquista(c) {
    var nome = estado.nome || '';
    soltarConfete(30);
    guideCelebrar(nome + '! Nova conquista: ' + c.nome + '!');
    falar(nome + ', voce conquistou: ' + c.nome + '! ' + c.desc);

    var notif = document.createElement('div');
    notif.className = 'achievement-notif';
    notif.innerHTML = ''
        + '<div class="achievement-notif-emoji">' + c.emoji + '</div>'
        + '<div class="achievement-notif-text">'
        +   '<div class="achievement-notif-title">' + c.nome + '</div>'
        +   '<div class="achievement-notif-desc">' + c.desc + '</div>'
        + '</div>';
    document.body.appendChild(notif);
    setTimeout(function() { notif.classList.add('show'); }, 50);
    setTimeout(function() {
        notif.classList.remove('show');
        setTimeout(function() { if (notif.parentNode) notif.parentNode.removeChild(notif); }, 500);
    }, 5000);
}

function registrarDiaJogado() {
    var hoje = new Date().toISOString().split('T')[0];
    if (!estado.diasJogados) estado.diasJogados = [];
    if (!estado.diasJogados.includes(hoje)) {
        estado.diasJogados.push(hoje);
        if (estado.diasJogados.length > 30) estado.diasJogados = estado.diasJogados.slice(-30);
        salvarEstado();
    }
    verificarDiasConsecutivos();
}

function verificarDiasConsecutivos() {
    if (!estado.diasJogados || estado.diasJogados.length === 0) return;
    var dias = estado.diasJogados.slice().sort();
    var hoje = new Date();
    var consecutivos = 0;
    for (var i = 0; i < 30; i++) {
        var d = new Date(hoje);
        d.setDate(d.getDate() - i);
        var dStr = d.toISOString().split('T')[0];
        if (dias.includes(dStr)) consecutivos++;
        else break;
    }
    if (consecutivos >= 3 && !estado.conquistasExtras.includes('tres_dias')) {
        estado.conquistasExtras.push('tres_dias');
        salvarEstado();
        mostrarNotificacaoConquista(CONQUISTAS_EXTRAS.find(function(c) { return c.id === 'tres_dias'; }));
    }
    if (consecutivos >= 7 && !estado.conquistasExtras.includes('sete_dias')) {
        estado.conquistasExtras.push('sete_dias');
        salvarEstado();
        mostrarNotificacaoConquista(CONQUISTAS_EXTRAS.find(function(c) { return c.id === 'sete_dias'; }));
    }
}

function atualizarConquistasExtrasUI() {
    var container = document.getElementById('extra-achievements');
    if (!container) return;
    container.innerHTML = '';
    CONQUISTAS_EXTRAS.forEach(function(c) {
        var desbloqueada = estado.conquistasExtras.includes(c.id);
        var div = document.createElement('div');
        div.className = 'extra-achievement' + (desbloqueada ? ' unlocked' : '');
        div.innerHTML = ''
            + '<span class="extra-ach-emoji">' + (desbloqueada ? c.emoji : '🔒') + '</span>'
            + '<span class="extra-ach-name">' + c.nome + '</span>'
            + '<span class="extra-ach-desc">' + c.desc + '</span>';
        div.title = c.desc;
        if (desbloqueada) {
            div.addEventListener('click', function() {
                falar(c.nome + '! ' + c.desc);
            });
        }
        container.appendChild(div);
    });
}

// ============================================
// ESTRELAS
// ============================================
function ganharEstrela() {
    estado.estrelas++;
    salvarEstado();
    var starsEl = document.getElementById('stars-count');
    if (starsEl) {
        starsEl.textContent = estado.estrelas;
        starsEl.parentElement.style.animation = 'star-pop 0.5s ease-out';
        setTimeout(function() { starsEl.parentElement.style.animation = ''; }, 500);
    }
    soltarConfete(15);
    verificarConquistas();
}

// ============================================
// MEDALHAS
// ============================================
function desbloquearMedalha(id) {
    if (!estado.medalhas.includes(id)) {
        estado.medalhas.push(id);
        var medalha = MEDALHAS.find(function(m) { return m.id === id; });
        if (medalha) setTimeout(function() { falar('Nova medalha: ' + medalha.nome); }, 1200);
        salvarEstado();
        atualizarMedalhas();
        soltarConfete(40);
        verificarConquistas();
    }
}

function marcarFaseCompleta(faseId) {
    if (!estado.fasesCompletas.includes(faseId)) {
        estado.fasesCompletas.push(faseId);
        salvarEstado();
    }
}

function atualizarMedalhas() {
    var grid = document.getElementById('medals-grid');
    if (!grid) return;
    grid.innerHTML = '';
    MEDALHAS.forEach(function(m) {
        var desbloqueada = estado.medalhas.includes(m.id);
        var div = document.createElement('div');
        div.className = 'medal' + (desbloqueada ? ' unlocked' : '');
        div.innerHTML = '<span class="medal-emoji">' + m.emoji + '</span><span class="medal-name">' + m.nome + '</span>';
        div.addEventListener('click', function() {
            if (desbloqueada) falar(m.nome + '! Você ganhou, ' + estado.nome + '!');
            else falar(m.nome);
        });
        grid.appendChild(div);
    });
}

// ============================================
// PROGRESSO
// ============================================
function atualizarProgresso() {
    var container = document.getElementById('story-progress');
    if (!container) return;
    container.innerHTML = '';
    FASES.forEach(function(f, idx) {
        var dot = document.createElement('span');
        dot.className = 'story-dot';
        if (idx === estado.faseIndex) dot.classList.add('active');
        if (idx < estado.faseIndex) dot.classList.add('completed');
        if (estado.fasesCompletas.includes(f.id)) dot.classList.add('completed');
        dot.textContent = f.emoji;
        dot.title = 'Fase ' + f.numero + ': ' + f.titulo;
        dot.addEventListener('click', function() { falar(f.titulo); });
        container.appendChild(dot);
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================
estado = carregarEstado();
criarEstrelas();
aplicarFonte(carregarFonte());
aplicarContraste(carregarContraste());

function initGame() {
    var btnStart = document.getElementById('btn-start');
    if (btnStart) btnStart.addEventListener('click', function() { iniciarJogo(false); });

    var btnFontInc = document.getElementById('btn-font-increase');
    if (btnFontInc) btnFontInc.addEventListener('click', aumentarFonte);

    var btnFontDec = document.getElementById('btn-font-decrease');
    if (btnFontDec) btnFontDec.addEventListener('click', diminuirFonte);

    var btnContrast = document.getElementById('btn-contrast');
    if (btnContrast) btnContrast.addEventListener('click', alternarContraste);

    var btnMusic = document.getElementById('btn-music');
    if (btnMusic) btnMusic.addEventListener('click', function() {
        var ligada = alternarMusica();
        btnMusic.textContent = ligada ? '🎵' : '🔇';
        btnMusic.classList.toggle('music-on', ligada);
    });

    var btnContinue = document.getElementById('btn-continue');
    if (btnContinue) btnContinue.addEventListener('click', function() { iniciarJogo(false); });

    var btnRestart = document.getElementById('btn-restart-start');
    if (btnRestart) btnRestart.addEventListener('click', function() { iniciarJogo(true); });

    var btnReview = document.getElementById('btn-review');
    if (btnReview) btnReview.addEventListener('click', mostrarTelaRevisao);

    var btnReviewBack = document.getElementById('btn-review-back');
    if (btnReviewBack) btnReviewBack.addEventListener('click', function() {
        document.getElementById('review-screen').style.display = 'none';
        mostrarTelaInicial();
    });

    var btnHome = document.getElementById('btn-home');
    if (btnHome) btnHome.addEventListener('click', function() { mostrarTelaInicial(); });

    var guideLamb = document.getElementById('guide-lamb');
    if (guideLamb) guideLamb.addEventListener('click', function() {
        var fase = FASES[estado.faseIndex];
        if (fase) guideDicaFase(fase);
    });

    var btnConfirmName = document.getElementById('btn-confirm-name');
    if (btnConfirmName) btnConfirmName.addEventListener('click', confirmarNome);

    var btnBackspace = document.getElementById('kb-backspace');
    if (btnBackspace) btnBackspace.addEventListener('click', apagarLetra);

    var btnClear = document.getElementById('kb-clear');
    if (btnClear) btnClear.addEventListener('click', limparNome);

    var btnBoy = document.getElementById('gender-boy');
    if (btnBoy) btnBoy.addEventListener('click', function() { selecionarGenero('masculino'); });

    var btnGirl = document.getElementById('gender-girl');
    if (btnGirl) btnGirl.addEventListener('click', function() { selecionarGenero('feminino'); });

    // Suporte ao teclado físico na tela de nome
    document.addEventListener('keydown', function(e) {
        var nameScreen = document.getElementById('name-screen');
        if (!nameScreen || nameScreen.style.display === 'none') return;

        if (e.key === 'Enter') {
            confirmarNome();
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            apagarLetra();
            return;
        }
        // Mapeia tecla física para letra do teclado virtual
        var tecla = e.key.toUpperCase();
        if (tecla.length === 1) {
            // Verifica se a letra existe no teclado virtual
            var encontrou = false;
            TECLAS_LINHAS.forEach(function(linha) {
                if (linha.indexOf(tecla) !== -1) encontrou = true;
            });
            if (encontrou) {
                adicionarLetra(tecla);
            }
        }
    });

    if (estado.nome && estado.genero) {
        mostrarTelaInicial();
    } else {
        mostrarTelaNome();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
