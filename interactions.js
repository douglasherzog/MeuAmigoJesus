// INTERACTIONS - Renderizadores de cenário e handlers de interação
// Meu Amigo Jesus - 28 fases com 10 tipos de interação diferentes

// Inicializa estrutura de imagens em todas as fases (para fases que ainda não possuem)
if (typeof FASES !== 'undefined') {
    FASES.forEach(function(f) {
        if (!f.imagens) {
            f.imagens = { fundo: null, fundoHistoria: null, personagens: {}, objetos: {} };
        }
    });
}

// Estado da interação atual
var estadoInteracao = { completo: false, progresso: 0, total: 0, sequenciaIdx: 0 };
var usarImagensGeradas = true;

// Cache de imagens já pré-carregadas
var imagensPrecarregadas = {};

function precarregarImagens(fase) {
    if (!usarImagensGeradas || !fase || !fase.imagens) return;
    var srcs = [];
    if (fase.imagens.fundo) srcs.push(fase.imagens.fundo);
    if (fase.imagens.fundoHistoria) srcs.push(fase.imagens.fundoHistoria);
    var mapa = fase.imagens.mapa || {};
    for (var chave in mapa) {
        if (mapa.hasOwnProperty(chave) && mapa[chave] && mapa[chave].src) {
            srcs.push(mapa[chave].src);
        }
    }
    srcs.forEach(function(src) {
        if (imagensPrecarregadas[src]) return;
        var img = new Image();
        img.src = src;
        imagensPrecarregadas[src] = img;
    });
}

function precarregarFaseAtualEProxima(faseIndex) {
    if (typeof FASES === 'undefined') return;
    if (FASES[faseIndex]) precarregarImagens(FASES[faseIndex]);
    if (FASES[faseIndex + 1]) precarregarImagens(FASES[faseIndex + 1]);
}

// ============================================
// HELPERS DE RENDERIZAÇÃO COM IMAGENS
// ============================================
function renderFundo(bg, fase, modoHistoria) {
    var imagens = fase.imagens || {};
    var fundoSrc = modoHistoria && imagens.fundoHistoria ? imagens.fundoHistoria : imagens.fundo;
    bg.className = 'scene-background ' + fase.cenario;
    bg.style.background = '';

    if (usarImagensGeradas && fundoSrc) {
        bg.style.background = 'url(' + fundoSrc + ') center/cover no-repeat';
        bg.classList.add('imagem-fundo');
    }
}

function criarElementoImagem(config, classeExtra, id) {
    var wrapper = document.createElement('div');
    wrapper.className = 'sprite-wrapper';
    wrapper.style.position = 'absolute';
    if (config.bottom !== undefined) wrapper.style.bottom = config.bottom;
    if (config.top !== undefined) wrapper.style.top = config.top;
    if (config.left !== undefined) wrapper.style.left = config.left;
    if (config.right !== undefined) wrapper.style.right = config.right;
    if (config.left === '50%') {
        var w = parseInt(config.width, 10) || 0;
        wrapper.style.marginLeft = (-w / 2) + 'px';
    }
    if (id) wrapper.id = id;

    var el = document.createElement('img');
    el.src = config.src;
    el.className = classeExtra;
    if (config.alt) el.alt = config.alt;
    if (config.width) el.style.width = config.width;
    if (config.width) el.style.height = config.width;
    el.style.objectFit = 'cover';
    el.style.transition = 'transform 0.3s ease';
    el.onerror = function() {
        wrapper.style.display = 'none';
    };

    wrapper.appendChild(el);

    if (config.titulo) {
        var balao = document.createElement('div');
        balao.className = 'sprite-balao';
        balao.textContent = config.titulo;
        wrapper.appendChild(balao);
    }

    return wrapper;
}

function renderPersonagem(content, chave, configPadrao, configFase, classeExtra, id) {
    var config = configFase && configFase[chave] ? configFase[chave] : null;
    if (!config && configPadrao) config = configPadrao;
    if (config && config.src) {
        var el = criarElementoImagem(config, 'personagem-imagem ' + (classeExtra || ''), id);
        content.appendChild(el);
        return el;
    }
    return null;
}

function renderObjeto(content, chave, configFase, classeExtra, id) {
    var config = configFase && configFase[chave] ? configFase[chave] : null;
    if (config && config.src) {
        var el = criarElementoImagem(config, 'objeto-imagem ' + (classeExtra || ''), id);
        content.appendChild(el);
        return el;
    }
    return null;
}

// Aplica imagens sobre elementos já renderizados (emoji ou HTML) sem perder event listeners
function ocultarCamadasLegadas(content, fase) {
    if (!usarImagensGeradas) return;

    var preservar = '.interactive-element, .draggable, .quiz-container, .escolha-container, .completar-container';
    Array.prototype.forEach.call(content.children, function(el) {
        if (!el.matches(preservar) && !el.querySelector('.interactive-element, .draggable, button, input')) {
            el.classList.add('cenario-legado-oculto');
        }
    });

    var mapa = (fase.imagens && fase.imagens.mapa) ? fase.imagens.mapa : {};
    for (var chave in mapa) {
        if (!mapa.hasOwnProperty(chave)) continue;
        var el = document.getElementById(chave) || content.querySelector('.' + chave);
        if (el && !el.classList.contains('interactive-element') && !el.classList.contains('draggable')) {
            el.classList.add('cenario-legado-oculto');
        }
    }
}

function aplicarImagens(content, fase) {
    if (!usarImagensGeradas) return;

    var mapa = (fase.imagens && fase.imagens.mapa) ? fase.imagens.mapa : {};
    for (var chave in mapa) {
        if (!mapa.hasOwnProperty(chave)) continue;
        var config = mapa[chave];
        if (!config || !config.src) continue;
        var el = document.getElementById(chave) || content.querySelector('.' + chave);
        if (!el) continue;
        if (!el.classList.contains('interactive-element') && !el.classList.contains('draggable')) continue;

        el.innerHTML = '';
        el.classList.add('imagem-overlay-container');
        if (config.width) el.style.width = config.width;
        if (config.width) el.style.height = config.width;
        if (config.bottom !== undefined) el.style.bottom = config.bottom;
        if (config.top !== undefined) el.style.top = config.top;
        if (config.left !== undefined) el.style.left = config.left;
        if (config.right !== undefined) el.style.right = config.right;
        if (config.left === '50%' && !el.style.transform) {
            var w = parseInt(config.width, 10) || 0;
            el.style.marginLeft = (-w / 2) + 'px';
        }

        var img = document.createElement('img');
        img.src = config.src;
        img.className = 'cenario-imagem-overlay entrada-cena';
        img.alt = chave;
        if (config.titulo) img.title = config.titulo;
        img.onerror = function() { img.style.display = 'none'; };
        el.appendChild(img);

    }
}

// ============================================
// RENDERIZAR CENÁRIO - despacha para cada fase
// ============================================
function renderizarCenario(fase) {
    var bg = document.getElementById('scene-background');
    var content = document.getElementById('scene-content');

    renderFundo(bg, fase, false);

    content.classList.remove('scene-fade-in');
    void content.offsetWidth;
    content.classList.add('scene-fade-in');

    content.innerHTML = '';
    estadoInteracao = { completo: false, progresso: 0, total: 0, sequenciaIdx: 0 };

    var renderer = CENARIO_RENDERERS[fase.cenario];
    if (renderer) renderer(content, fase);

    ocultarCamadasLegadas(content, fase);
    aplicarImagens(content, fase);
}

// ============================================
// RENDERIZADORES DE CENÁRIO POR FASE
// ============================================
var CENARIO_RENDERERS = {

    // Fase 1: Anunciação
    anunciacao: function(content, fase) {
        content.innerHTML = ''
            + '<div class="room-bg"></div>'
            + '<div class="sunbeam"></div>'
            + '<div class="mary-kneeling" id="mary-kneeling">🧎‍♀️</div>'
            + '<div class="anjo-gabriel interactive-element" id="anjo-gabriel">👼</div>'
            + '<div class="lily-flower" id="lily-flower">🌸</div>';
        bindClick('anjo-gabriel', fase);
    },

    // Fase 2: Nascimento
    nascimento: function(content, fase) {
        content.innerHTML = ''
            + '<div class="night-sky"></div>'
            + '<div class="angel">👼</div>'
            + '<div class="stable">⛺</div>'
            + '<div class="star-of-bethlehem interactive-element" id="star-bethlehem">⭐</div>'
            + '<div class="baby-jesus">👶</div>'
            + '<div class="mary-jose">🧎‍♀️👨</div>';
        bindClick('star-bethlehem', fase);
    },

    // Fase 3: Pastores
    pastores: function(content, fase) {
        content.innerHTML = ''
            + '<div class="field-bg"></div>'
            + '<div class="sheep" style="left:10%; bottom:5%;">🐑</div>'
            + '<div class="sheep" style="right:15%; bottom:8%;">🐑</div>'
            + '<div class="sheep" style="left:45%; bottom:3%;">🐑</div>'
            + '<div class="fire">🔥</div>'
            + '<div class="hidden-pastor interactive-element" id="pastor1" style="left:15%; bottom:20%;">🧑‍🌾</div>'
            + '<div class="hidden-pastor interactive-element" id="pastor2" style="right:20%; bottom:25%;">🧑‍🌾</div>'
            + '<div class="hidden-pastor interactive-element" id="pastor3" style="left:50%; bottom:40%;">🧑‍🌾</div>'
            + '<div class="angel-appears">👼</div>';
        bindEncontrar(['pastor1', 'pastor2', 'pastor3'], fase);
    },

    // Fase 4: Reis Magos
    reismagos: function(content, fase) {
        content.innerHTML = ''
            + '<div class="desert-night"></div>'
            + '<div class="big-star">⭐</div>'
            + '<div class="magos">🧙‍♂️🧙🧙‍♂️</div>'
            + '<div class="gifts">🎁👑</div>'
            + '<div class="star-path interactive-element" id="estrela1" style="left:15%; top:20%;">⭐</div>'
            + '<div class="star-path interactive-element" id="estrela2" style="left:35%; top:30%;">⭐</div>'
            + '<div class="star-path interactive-element" id="estrela3" style="left:55%; top:25%;">⭐</div>'
            + '<div class="star-path interactive-element" id="estrela4" style="left:75%; top:35%;">⭐</div>';
        bindSequencia(['estrela1', 'estrela2', 'estrela3', 'estrela4'], fase);
    },

    // Fase 5: Simeão no Templo
    templo: function(content, fase) {
        content.innerHTML = ''
            + '<div class="temple-bg"></div>'
            + '<div class="temple-pillars">🏛️</div>'
            + '<div class="simeao-old">🧓</div>'
            + '<div class="baby-in-arms">👶</div>'
            + '<div class="mary-jose-temple">🧎‍♀️👨</div>';
        renderQuiz(content, fase);
    },

    // Fase 6: Jesus aos 12 anos
    templo12: function(content, fase) {
        content.innerHTML = ''
            + '<div class="temple-bg"></div>'
            + '<div class="temple-pillars">🏛️</div>'
            + '<div class="jesus-boy">👦</div>'
            + '<div class="teachers">👨‍🏫👨‍🏫👨‍🏫</div>'
            + '<div class="scroll">📜</div>';
        renderQuiz(content, fase);
    },

    // Fase 7: Batismo
    batismo: function(content, fase) {
        content.innerHTML = ''
            + '<div class="river"></div>'
            + '<div class="dove" id="dove">🕊️</div>'
            + '<div class="jesus-in-river interactive-element" id="jesus-river">🙏</div>'
            + '<div class="joao-batista">👨</div>'
            + '<div class="river-light"></div>';
        bindClick('jesus-river', fase);
    },

    // Fase 8: Deserto - Tentação
    deserto: function(content, fase) {
        content.innerHTML = ''
            + '<div class="desert-rock"></div>'
            + '<div class="jesus-in-desert">🙏</div>'
            + '<div class="temptation-choice" id="desert-choice">'
            +   '<div class="food-temptation">🍞</div>'
            +   '<div class="bible-choice" id="bible">📖</div>'
            + '</div>';
        renderEscolha(content, fase);
    },

    // Fase 9: Pescadores
    pescadores: function(content, fase) {
        content.innerHTML = ''
            + '<div class="river" style="height:45%;"></div>'
            + '<div class="boat" id="boat">🛶</div>'
            + '<div class="fisherman interactive-element" style="left:25%;" id="p1">🧑‍🦱</div>'
            + '<div class="fisherman interactive-element" style="right:25%;" id="p2">🧑</div>'
            + '<div class="fisherman interactive-element" style="left:40%; bottom:50%;" id="p3">👨</div>'
            + '<div class="fisherman interactive-element" style="right:40%; bottom:50%;" id="p4">👦</div>'
            + '<div class="fish" style="left:20%;">🐟</div>'
            + '<div class="fish" style="right:20%; animation-delay:1s;">🐠</div>';
        bindClicarMulti(['p1', 'p2', 'p3', 'p4'], fase);
    },

    // Fase 10: Bodas de Cana
    cana: function(content, fase) {
        content.innerHTML = ''
            + '<div class="wedding-bg"></div>'
            + '<div class="wedding-table">🍽️</div>'
            + '<div class="jesus-cana" id="jesus-cana">🙏</div>'
            + '<div class="jarra draggable" id="jarra1">🏺</div>'
            + '<div class="jarra draggable" id="jarra2">🏺</div>'
            + '<div class="jarra draggable" id="jarra3">🏺</div>'
            + '<div class="wine-cups">🍷🍷🍷</div>';
        bindArrastar(['jarra1', 'jarra2', 'jarra3'], 'jesus-cana', fase);
    },

    // Fase 11: Bem-aventuranças
    monte: function(content, fase) {
        content.innerHTML = ''
            + '<div class="mountain">⛰️</div>'
            + '<div class="jesus-on-mountain">🙏</div>'
            + '<div class="children-group">'
            +   '<div class="child" id="c1">🧒</div>'
            +   '<div class="child" id="c2">👧</div>'
            +   '<div class="child" id="c3">👶</div>'
            + '</div>'
            + '<div class="sun">☀️</div>';
        renderCompletar(content, fase);
    },

    // Fase 12: Cura do cego
    curaciego: function(content, fase) {
        content.innerHTML = ''
            + '<div class="village-bg"></div>'
            + '<div class="jesus-healer">🙏</div>'
            + '<div class="blind-man interactive-element" id="blind-man">🧑‍🦯</div>'
            + '<div class="mud" id="mud">🟤</div>'
            + '<div class="healed-eyes" id="healed-eyes">👁️</div>';
        bindClick('blind-man', fase);
    },

    // Fase 13: Multiplicação dos pães
    paes: function(content, fase) {
        content.innerHTML = ''
            + '<div class="grass"></div>'
            + '<div class="crowd">👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦</div>'
            + '<div class="basket" id="basket">🧺</div>'
            + '<div class="food-items" id="food-items">'
            +   '<span class="food-item">🍞</span>'
            +   '<span class="food-item">🐟</span>'
            + '</div>'
            + '<div class="jesus-bread">🙏</div>';
        renderContar(content, fase);
    },

    // Fase 14: Anda sobre a água
    aguas: function(content, fase) {
        content.innerHTML = ''
            + '<div class="stormy-sea"></div>'
            + '<div class="boat-storm" id="boat-storm">🛶</div>'
            + '<div class="jesus-walking interactive-element" id="jesus-walking">🙏</div>'
            + '<div class="disciples-scared">😨</div>'
            + '<div class="lightning">⚡</div>';
        bindClick('jesus-walking', fase);
    },

    // Fase 15: Parábola do semeador
    semeador: function(content, fase) {
        content.innerHTML = ''
            + '<div class="field-sunny"></div>'
            + '<div class="path-ground" style="left:10%; bottom:10%;">🪨</div>'
            + '<div class="thorns" style="right:15%; bottom:15%;">🌿</div>'
            + '<div class="boa-terra" id="boa-terra" style="left:40%; bottom:20%;">🌱</div>'
            + '<div class="semente draggable" id="semente1" style="left:20%; bottom:50%;">🌰</div>'
            + '<div class="semente draggable" id="semente2" style="left:50%; bottom:55%;">🌰</div>'
            + '<div class="semente draggable" id="semente3" style="left:75%; bottom:48%;">🌰</div>'
            + '<div class="farmer">🧑‍🌾</div>';
        bindArrastar(['semente1', 'semente2', 'semente3'], 'boa-terra', fase);
    },

    // Fase 16: Zaqueu
    zaqueu: function(content, fase) {
        content.innerHTML = ''
            + '<div class="city-bg"></div>'
            + '<div class="tree interactive-element" id="tree">🌳</div>'
            + '<div class="zaqueu" id="zaqueu">🧍</div>'
            + '<div class="jesus-looks-up">🙏</div>'
            + '<div class="house">🏠</div>';
        bindClick('tree', fase);
    },

    // Fase 17: Bom Samaritano
    bomsamaritano: function(content, fase) {
        content.innerHTML = ''
            + '<div class="road-bg"></div>'
            + '<div class="scene-item interactive-element" id="cena-ferido" style="left:10%; bottom:15%;">🤕</div>'
            + '<div class="scene-item interactive-element" id="cena-sacerdote" style="left:35%; bottom:15%;">🧑‍🦱</div>'
            + '<div class="scene-item interactive-element" id="cena-samaritano" style="left:60%; bottom:15%;">🧑</div>'
            + '<div class="scene-item interactive-element" id="cena-cuidado" style="right:10%; bottom:15%;">🏥</div>'
            + '<div class="road-line"></div>';
        bindSequencia(['cena-ferido', 'cena-sacerdote', 'cena-samaritano', 'cena-cuidado'], fase);
    },

    // Fase 18: Entrada em Jerusalém
    jerusalem: function(content, fase) {
        content.innerHTML = ''
            + '<div class="city-gate"></div>'
            + '<div class="jesus-on-donkey">🙏🐴</div>'
            + '<div class="crowd-cheering">👨‍👩‍👧‍👦👨‍👩‍👧‍👦</div>'
            + '<div class="palms-group">'
            +   '<div class="palm interactive-element" id="palm1">🌿</div>'
            +   '<div class="palm interactive-element" id="palm2">🌿</div>'
            +   '<div class="palm interactive-element" id="palm3">🌿</div>'
            +   '<div class="palm interactive-element" id="palm4">🌿</div>'
            + '</div>'
            + '<div class="hosana-text" id="hosana-text">HOSANA!</div>';
        bindClicarMulti(['palm1', 'palm2', 'palm3', 'palm4'], fase);
    },

    // Fase 19: Última Ceia
    ceia: function(content, fase) {
        content.innerHTML = ''
            + '<div class="dinner-room"></div>'
            + '<div class="table">🍽️</div>'
            + '<div class="bread interactive-element" id="last-bread">🍞</div>'
            + '<div class="wine interactive-element" id="last-wine">🍷</div>'
            + '<div class="disciples-table">🧑‍🦱🧑👨👦</div>'
            + '<div class="jesus-at-table">🙏</div>';
        bindClicarMulti(['last-bread', 'last-wine'], fase);
    },

    // Fase 20: Getsemani
    getsemani: function(content, fase) {
        content.innerHTML = ''
            + '<div class="garden-night"></div>'
            + '<div class="olive-tree">🌳</div>'
            + '<div class="jesus-praying">🙏</div>'
            + '<div class="moon">🌙</div>'
            + '<div class="prayer-drop interactive-element" id="gota1" style="left:25%; top:30%;">💧</div>'
            + '<div class="prayer-drop interactive-element" id="gota2" style="left:40%; top:45%;">💧</div>'
            + '<div class="prayer-drop interactive-element" id="gota3" style="left:55%; top:25%;">💧</div>'
            + '<div class="prayer-drop interactive-element" id="gota4" style="left:65%; top:50%;">💧</div>'
            + '<div class="prayer-drop interactive-element" id="gota5" style="left:35%; top:55%;">💧</div>'
            + '<div class="sleeping-disciples">😴😴</div>';
        bindOrar(['gota1', 'gota2', 'gota3', 'gota4', 'gota5'], fase);
    },

    // Fase 21: Cruz
    cruz: function(content, fase) {
        content.innerHTML = ''
            + '<div class="calvary-hill"></div>'
            + '<div class="sky-glow"></div>'
            + '<div class="cross-gentle" id="cross-gentle">✝️</div>'
            + '<div class="love-heart interactive-element" id="love-heart">💜</div>'
            + '<div class="angels-comfort">👼👼</div>'
            + '<div class="child-prays" id="child-prays">🧎</div>';
        bindClick('love-heart', fase);
    },

    // Fase 22: Ressurreição
    ressurreicao: function(content, fase) {
        content.innerHTML = ''
            + '<div class="garden-morning"></div>'
            + '<div class="tomb" id="tomb">⛰️</div>'
            + '<div class="stone interactive-element" id="stone">🪨</div>'
            + '<div class="jesus-risen" id="jesus-risen">🙏</div>'
            + '<div class="sun-rise">🌅</div>'
            + '<div class="angels-tomb">👼👼</div>'
            + '<div class="flowers">🌷🌼🌸</div>';
        bindClick('stone', fase);
    },

    // Fase 23: Ascensão
    ascensao: function(content, fase) {
        content.innerHTML = ''
            + '<div class="sky-ascension"></div>'
            + '<div class="clouds">'
            +   '<div class="cloud" style="left:10%; top:20%;">☁️</div>'
            +   '<div class="cloud" style="right:15%; top:35%;">☁️</div>'
            +   '<div class="cloud" style="left:50%; top:15%;">☁️</div>'
            + '</div>'
            + '<div class="jesus-ascend interactive-element" id="jesus-ascend">🙏</div>'
            + '<div class="disciples-watching">👨‍🦱🧑👨👦</div>'
            + '<div class="light-from-heaven"></div>';
        bindClick('jesus-ascend', fase);
    },

    // Fase 24: A Promessa do Consolador
    promessa: function(content, fase) {
        content.innerHTML = ''
            + '<div class="promise-bg"></div>'
            + '<div class="clouds">'
            +   '<div class="cloud" style="left:15%; top:20%;">☁️</div>'
            +   '<div class="cloud" style="right:20%; top:30%;">☁️</div>'
            + '</div>'
            + '<div class="jesus-promessa interactive-element" id="jesus-promessa">🙏</div>'
            + '<div class="dove-promise" style="position:absolute; top:15%; left:45%; font-size:2.5rem; animation:float-particle 4s ease-in-out infinite;">🕊️</div>'
            + '<div class="light-from-heaven"></div>';
        bindClick('jesus-promessa', fase);
    },

    // Fase 25: Esperando em Oração
    espera: function(content, fase) {
        content.innerHTML = ''
            + '<div class="upper-room-bg"></div>'
            + '<div class="room-candles" style="position:absolute; top:10%; left:20%; font-size:1.5rem;">🕯️</div>'
            + '<div class="room-candles" style="position:absolute; top:10%; right:20%; font-size:1.5rem;">🕯️</div>'
            + '<div class="praying-friend interactive-element" id="amigo1" style="position:absolute; left:15%; bottom:15%; font-size:2rem;">🙏</div>'
            + '<div class="praying-friend interactive-element" id="amigo2" style="position:absolute; left:35%; bottom:20%; font-size:2rem;">🙏</div>'
            + '<div class="praying-friend interactive-element" id="amigo3" style="position:absolute; right:35%; bottom:20%; font-size:2rem;">🙏</div>'
            + '<div class="praying-friend interactive-element" id="amigo4" style="position:absolute; right:15%; bottom:15%; font-size:2rem;">🙏</div>';
        bindClicarMulti(['amigo1', 'amigo2', 'amigo3', 'amigo4'], fase);
    },

    // Fase 26: Pentecostes
    pentecostes: function(content, fase) {
        content.innerHTML = ''
            + '<div class="pentecost-bg"></div>'
            + '<div class="wind-effect"></div>'
            + '<div class="fire-tongue interactive-element" id="fogo1" style="position:absolute; left:15%; top:20%; font-size:2rem;">🔥</div>'
            + '<div class="fire-tongue interactive-element" id="fogo2" style="position:absolute; left:35%; top:15%; font-size:2rem;">🔥</div>'
            + '<div class="fire-tongue interactive-element" id="fogo3" style="position:absolute; left:50%; top:25%; font-size:2rem;">🔥</div>'
            + '<div class="fire-tongue interactive-element" id="fogo4" style="position:absolute; right:35%; top:18%; font-size:2rem;">🔥</div>'
            + '<div class="fire-tongue interactive-element" id="fogo5" style="position:absolute; right:15%; top:22%; font-size:2rem;">🔥</div>'
            + '<div class="filled-disciples" style="position:absolute; bottom:10%; left:25%; font-size:1.8rem;">😊🙏😊🙏😊</div>';
        bindClicarMulti(['fogo1', 'fogo2', 'fogo3', 'fogo4', 'fogo5'], fase);
    },

    // Fase 27: O Consolador no Coração
    consolador: function(content, fase) {
        content.innerHTML = ''
            + '<div class="consolador-bg"></div>'
            + '<div class="heart-glow"></div>'
            + '<div class="big-heart interactive-element" id="coracao-consolador" style="position:absolute; top:30%; left:50%; transform:translateX(-50%); font-size:5rem;">💜</div>'
            + '<div class="dove-promise" style="position:absolute; top:15%; left:45%; font-size:2rem; animation:float-particle 4s ease-in-out infinite;">🕊️</div>'
            + '<div class="fruits-preview" style="position:absolute; bottom:15%; left:50%; transform:translateX(-50%); font-size:1.5rem; display:flex; gap:15px;">❤️ 😊 ✌️ 🌟</div>';
        bindClick('coracao-consolador', fase);
    },

    // Fase 28: Os Frutos do Espírito
    frutos: function(content, fase) {
        content.innerHTML = ''
            + '<div class="frutos-bg"></div>'
            + '<div class="fruit-tree" style="position:absolute; bottom:5%; left:50%; transform:translateX(-50%); font-size:6rem;">🌳</div>'
            + '<div class="fruit interactive-element" id="fruto1" style="position:absolute; left:25%; top:25%; font-size:2rem;">❤️</div>'
            + '<div class="fruit interactive-element" id="fruto2" style="position:absolute; left:40%; top:18%; font-size:2rem;">😊</div>'
            + '<div class="fruit interactive-element" id="fruto3" style="position:absolute; left:55%; top:22%; font-size:2rem;">✌️</div>'
            + '<div class="fruit interactive-element" id="fruto4" style="position:absolute; right:35%; top:30%; font-size:2rem;">🌟</div>'
            + '<div class="fruit interactive-element" id="fruto5" style="position:absolute; right:20%; top:25%; font-size:2rem;">🤝</div>'
            + '<div class="fruit interactive-element" id="fruto6" style="position:absolute; left:35%; top:35%; font-size:2rem;">🙏</div>';
        bindClicarMulti(['fruto1', 'fruto2', 'fruto3', 'fruto4', 'fruto5', 'fruto6'], fase);
    }
};

// ============================================
// BINDERS DE INTERAÇÃO
// ============================================

// Click simples
function bindClick(elementId, fase) {
    setTimeout(function() {
        var el = document.getElementById(elementId);
        if (el) el.addEventListener('click', function() { if (falando) return; executarInteracao(fase); });
    }, 100);
}

// Click múltiplo - conta quantos foram clicados
function bindClicarMulti(alvos, fase) {
    estadoInteracao.total = alvos.length;
    estadoInteracao.progresso = 0;
    setTimeout(function() {
        alvos.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('click', function() {
                if (falando) return;
                if (el.classList.contains('done')) return;
                el.classList.add('done');
                estadoInteracao.progresso++;
                animarClicarMulti(el);
                atualizarProgressoInteracao();
                if (estadoInteracao.progresso >= estadoInteracao.total) {
                    executarInteracao(fase);
                }
            });
        });
    }, 100);
}

// Encontrar elementos escondidos
function bindEncontrar(alvos, fase) {
    estadoInteracao.total = alvos.length;
    estadoInteracao.progresso = 0;
    setTimeout(function() {
        alvos.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('click', function() {
                if (falando) return;
                if (el.classList.contains('found')) return;
                el.classList.add('found');
                estadoInteracao.progresso++;
                animarEncontrar(el);
                atualizarProgressoInteracao();
                if (estadoInteracao.progresso >= estadoInteracao.total) {
                    executarInteracao(fase);
                }
            });
        });
    }, 100);
}

// Sequência - clicar em ordem certa
function bindSequencia(sequencia, fase) {
    estadoInteracao.total = sequencia.length;
    estadoInteracao.progresso = 0;
    estadoInteracao.sequenciaIdx = 0;
    setTimeout(function() {
        sequencia.forEach(function(id, idx) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('click', function() {
                if (falando) return;
                if (el.classList.contains('done')) return;
                if (idx === estadoInteracao.sequenciaIdx) {
                    el.classList.add('done');
                    estadoInteracao.sequenciaIdx++;
                    estadoInteracao.progresso++;
                    animarSequenciaOk(el, idx);
                    atualizarProgressoInteracao();
                    if (estadoInteracao.progresso >= estadoInteracao.total) {
                        executarInteracao(fase);
                    }
                } else {
                    animarSequenciaErrada(el);
                    falar('Ops! Tente na ordem certa!');
                }
            });
        });
    }, 100);
}

// Arrastar - drag and drop
function bindArrastar(alvos, destinoId, fase) {
    estadoInteracao.total = alvos.length;
    estadoInteracao.progresso = 0;
    setTimeout(function() {
        var destino = document.getElementById(destinoId);
        if (!destino) return;
        destino.classList.add('drop-zone');

        alvos.forEach(function(id) {
            var el = document.getElementById(id);
            if (!el) return;

            var isDragging = false;
            var offsetX = 0, offsetY = 0;

            function startDrag(e) {
                if (falando) return;
                if (el.classList.contains('dropped')) return;
                e.preventDefault();
                isDragging = true;
                el.classList.add('dragging');
                var rect = el.getBoundingClientRect();
                var point = e.touches ? e.touches[0] : e;
                offsetX = point.clientX - rect.left;
                offsetY = point.clientY - rect.top;
            }

            function doDrag(e) {
                if (!isDragging) return;
                e.preventDefault();
                var point = e.touches ? e.touches[0] : e;
                el.style.position = 'fixed';
                el.style.left = (point.clientX - offsetX) + 'px';
                el.style.top = (point.clientY - offsetY) + 'px';
                el.style.zIndex = '100';
            }

            function endDrag(e) {
                if (!isDragging) return;
                isDragging = false;
                el.classList.remove('dragging');

                var destRect = destino.getBoundingClientRect();
                var elRect = el.getBoundingClientRect();
                var centerX = elRect.left + elRect.width / 2;
                var centerY = elRect.top + elRect.height / 2;

                if (centerX > destRect.left && centerX < destRect.right &&
                    centerY > destRect.top && centerY < destRect.bottom) {
                    el.classList.add('dropped');
                    estadoInteracao.progresso++;
                    animarArrastarOk(el, destino);
                    atualizarProgressoInteracao();
                    if (estadoInteracao.progresso >= estadoInteracao.total) {
                        executarInteracao(fase);
                    }
                } else {
                    el.style.position = '';
                    el.style.left = '';
                    el.style.top = '';
                    el.style.zIndex = '';
                }
            }

            el.addEventListener('mousedown', startDrag);
            el.addEventListener('touchstart', startDrag, { passive: false });
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('touchmove', doDrag, { passive: false });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        });
    }, 100);
}

// Orar - clicar em gotas de oração
function bindOrar(alvos, fase) {
    estadoInteracao.total = alvos.length;
    estadoInteracao.progresso = 0;
    setTimeout(function() {
        alvos.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('click', function() {
                if (falando) return;
                if (el.classList.contains('prayed')) return;
                el.classList.add('prayed');
                estadoInteracao.progresso++;
                animarOrar(el);
                atualizarProgressoInteracao();
                if (estadoInteracao.progresso >= estadoInteracao.total) {
                    executarInteracao(fase);
                }
            });
        });
    }, 100);
}

// ============================================
// RENDERIZADORES DE UI PARA QUIZ/ESCOLHA/COMPLETAR/CONTAR
// ============================================

function renderQuiz(content, fase) {
    var dados = fase.dados;
    var div = document.createElement('div');
    div.className = 'quiz-container';
    div.innerHTML = '<p class="quiz-question">' + dados.pergunta + '</p>';
    dados.opcoes.forEach(function(opcao, idx) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerHTML = '<span class="quiz-letter">' + String.fromCharCode(65 + idx) + '</span> ' + opcao;
        btn.addEventListener('click', function() {
            if (falando) return;
            if (idx === dados.correta) {
                btn.classList.add('correct');
                div.querySelectorAll('.quiz-option').forEach(function(b) { b.disabled = true; });
                executarInteracao(fase);
            } else {
                btn.classList.add('wrong');
                btn.style.animation = 'shake 0.5s';
                falar('Tente de novo!');
            }
        });
        div.appendChild(btn);
    });
    content.appendChild(div);
}

function renderEscolha(content, fase) {
    var dados = fase.dados;
    var div = document.createElement('div');
    div.className = 'escolha-container';
    div.innerHTML = '';

    var btnYes = document.createElement('button');
    btnYes.className = 'big-btn choice-btn yes';
    btnYes.innerHTML = '<span class="btn-emoji">' + dados.opcaoCerta.emoji + '</span><span class="btn-text">' + dados.opcaoCerta.texto + '</span>';
    btnYes.addEventListener('click', function() {
        if (falando) return;
        executarInteracao(fase);
    });
    div.appendChild(btnYes);

    var btnNo = document.createElement('button');
    btnNo.className = 'big-btn choice-btn no';
    btnNo.innerHTML = '<span class="btn-emoji">' + dados.opcaoErrada.emoji + '</span><span class="btn-text">' + dados.opcaoErrada.texto + '</span>';
    btnNo.addEventListener('click', function() {
        if (falando) return;
        btnNo.style.animation = 'shake 0.5s';
        document.getElementById('speech-bubble').textContent = 'Jesus escolheu obedecer a Deus! Tente de novo! 📖';
        falar('Tente de novo! Escolha a Palavra de Deus!');
    });
    div.appendChild(btnNo);

    content.appendChild(div);
}

function renderCompletar(content, fase) {
    var dados = fase.dados;
    var div = document.createElement('div');
    div.className = 'completar-container';
    div.innerHTML = '<p class="completar-frase">' + dados.frase + '</p>';
    dados.opcoes.forEach(function(opcao, idx) {
        var btn = document.createElement('button');
        btn.className = 'completar-option';
        btn.textContent = opcao;
        btn.addEventListener('click', function() {
            if (falando) return;
            if (idx === dados.correta) {
                btn.classList.add('correct');
                div.querySelectorAll('.completar-option').forEach(function(b) { b.disabled = true; });
                var fraseEl = div.querySelector('.completar-frase');
                fraseEl.innerHTML = dados.frase.replace('___', '<strong>' + opcao + '</strong>');
                executarInteracao(fase);
            } else {
                btn.classList.add('wrong');
                btn.style.animation = 'shake 0.5s';
                falar('Tente de novo!');
            }
        });
        div.appendChild(btn);
    });
    content.appendChild(div);
}

function renderContar(content, fase) {
    var dados = fase.dados;
    var div = document.createElement('div');
    div.className = 'quiz-container';
    div.innerHTML = '<p class="quiz-question">' + dados.pergunta + '</p>';
    dados.opcoes.forEach(function(opcao, idx) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerHTML = '<span class="quiz-letter">' + String.fromCharCode(65 + idx) + '</span> ' + opcao;
        btn.addEventListener('click', function() {
            if (falando) return;
            if (idx === dados.correta) {
                btn.classList.add('correct');
                div.querySelectorAll('.quiz-option').forEach(function(b) { b.disabled = true; });
                executarInteracao(fase);
            } else {
                btn.classList.add('wrong');
                btn.style.animation = 'shake 0.5s';
                falar('Tente de novo! Conte os pães!');
            }
        });
        div.appendChild(btn);
    });
    content.appendChild(div);
}

// ============================================
// EXECUTAR INTERAÇÃO - animações de conclusão
// ============================================
function executarInteracao(fase) {
    if (estadoInteracao.completo) return;
    estadoInteracao.completo = true;

    // Animações específicas por cenário
    var anim = ANIMACOES_CONCLUSAO[fase.cenario];
    if (anim) anim();

    // Efeitos gerais
    animarCoracoes();
    for (var i = 0; i < 5; i++) {
        setTimeout(criarRaioDeLuz, i * 200);
    }

    // Som de conclusão
    if (fase.som) {
        setTimeout(function() {
            falar(fase.som, function() {
                avancarEtapa(fase);
            });
        }, 500);
    } else {
        setTimeout(function() {
            avancarEtapa(fase);
        }, 1500);
    }
}

// ============================================
// ANIMAÇÕES DE CONCLUSÃO POR CENÁRIO
// ============================================
var ANIMACOES_CONCLUSAO = {

    anunciacao: function() {
        var anjo = document.getElementById('anjo-gabriel');
        if (anjo) { anjo.style.animation = 'angel-glow 2s ease-in-out infinite'; anjo.style.transform = 'scale(1.3)'; }
        var mary = document.querySelector('.mary-kneeling');
        if (mary) mary.style.animation = 'mary-rejoice 1s ease-in-out infinite';
    },

    nascimento: function() {
        var star = document.getElementById('star-bethlehem');
        if (star) { star.style.animation = 'star-burst 2s ease-in-out infinite'; star.style.transform = 'scale(1.5)'; }
        var baby = document.querySelector('.baby-jesus');
        if (baby) baby.style.animation = 'baby-glow 2s ease-in-out infinite';
        for (var i = 0; i < 6; i++) setTimeout(criarRaioDeLuz, i * 200);
    },

    pastores: function() {
        document.querySelectorAll('.hidden-pastor').forEach(function(p) {
            p.style.animation = 'pastor-rejoice 1s ease-in-out infinite';
        });
    },

    reismagos: function() {
        var bigStar = document.querySelector('.big-star');
        if (bigStar) { bigStar.style.animation = 'star-burst 2s ease-in-out infinite'; bigStar.style.transform = 'scale(1.3)'; }
        var magos = document.querySelector('.magos');
        if (magos) magos.style.animation = 'magos-walk 2s ease-in-out forwards';
    },

    templo: function() {
        var simeao = document.querySelector('.simeao-old');
        if (simeao) { simeao.style.animation = 'simeao-joy 1s ease-in-out infinite'; }
    },

    templo12: function() {
        var jesus = document.querySelector('.jesus-boy');
        if (jesus) jesus.style.animation = 'jesus-teach 1s ease-in-out infinite';
    },

    batismo: function() {
        var dove = document.getElementById('dove');
        if (dove) { dove.classList.add('show'); dove.style.animation = 'dove-descend 2s ease-in-out, angel-float 3s ease-in-out infinite 2s'; }
    },

    deserto: function() {
        var bible = document.getElementById('bible');
        if (bible) { bible.style.animation = 'bible-glow 2s ease-in-out infinite'; bible.style.transform = 'scale(1.3)'; }
    },

    pescadores: function() {
        document.querySelectorAll('.fisherman.done').forEach(function(p, i) {
            setTimeout(function() {
                p.style.transform = 'scale(1.3) translateY(-20px)';
                p.style.filter = 'brightness(1.3) saturate(1.2)';
            }, i * 200);
        });
    },

    cana: function() {
        document.querySelectorAll('.jarra.dropped').forEach(function(j, i) {
            setTimeout(function() {
                j.style.animation = 'wine-transform 1s ease-out';
                j.style.filter = 'brightness(1.3) saturate(1.3) hue-rotate(-10deg)';
            }, i * 300);
        });
    },

    monte: function() {
        document.querySelectorAll('.child').forEach(function(c, i) {
            setTimeout(function() {
                c.style.transform = 'scale(1.2) translateY(-15px)';
                c.style.filter = 'brightness(1.3) saturate(1.2)';
            }, i * 200);
        });
        var sun = document.querySelector('.sun');
        if (sun) sun.style.animation = 'sun-pulse 1s ease-in-out infinite';
    },

    curaciego: function() {
        var blind = document.getElementById('blind-man');
        var healed = document.getElementById('healed-eyes');
        if (blind) { blind.style.transform = 'scale(1.2)'; blind.style.filter = 'brightness(1.3) saturate(1.2)'; }
        if (healed) { healed.style.opacity = '1'; healed.style.animation = 'eyes-blink 1s ease-in-out infinite'; }
        for (var i = 0; i < 5; i++) setTimeout(criarRaioDeLuz, i * 300);
    },

    paes: function() {
        var basket = document.getElementById('basket');
        var foodContainer = document.getElementById('food-items');
        if (basket) { basket.style.transform = 'scale(1.2)'; basket.style.filter = 'brightness(1.3) saturate(1.2)'; }
        if (foodContainer) {
            foodContainer.style.filter = 'brightness(1.3) saturate(1.3)';
            foodContainer.style.transform = 'scale(1.15)';
            foodContainer.style.transition = 'all 0.5s ease';
        }
    },

    aguas: function() {
        var jesus = document.getElementById('jesus-walking');
        var boat = document.getElementById('boat-storm');
        if (jesus) { jesus.style.transition = 'all 2s ease-in-out'; jesus.style.transform = 'translateX(120px) translateY(-20px)'; }
        if (boat) boat.style.animation = 'boat-calm 2s ease-in-out infinite';
        var sea = document.querySelector('.stormy-sea');
        if (sea) sea.classList.add('calm-sea');
    },

    semeador: function() {
        document.querySelectorAll('.semente.dropped').forEach(function(s, i) {
            setTimeout(function() {
                s.style.animation = 'plant-grow 1.5s ease-out';
                s.style.filter = 'brightness(1.3) saturate(1.3)';
            }, i * 300);
        });
    },

    zaqueu: function() {
        var tree = document.getElementById('tree');
        var zaqueu = document.getElementById('zaqueu');
        if (tree) tree.style.transform = 'rotate(5deg)';
        if (zaqueu) { zaqueu.style.transition = 'all 1s ease-in-out'; zaqueu.style.transform = 'translateY(80px)'; zaqueu.style.filter = 'brightness(1.3) saturate(1.2)'; }
        setTimeout(function() {
            var house = document.querySelector('.house');
            if (house) { house.style.transform = 'scale(1.1)'; house.style.boxShadow = '0 0 30px rgba(255,215,0,0.6)'; }
        }, 1000);
    },

    bomsamaritano: function() {
        document.querySelectorAll('.scene-item.done').forEach(function(s, i) {
            setTimeout(function() {
                s.style.transform = 'scale(1.2)';
                s.style.boxShadow = '0 0 20px rgba(255,215,0,0.6)';
            }, i * 200);
        });
    },

    jerusalem: function() {
        document.querySelectorAll('.palm.done').forEach(function(p, i) {
            setTimeout(function() { p.style.transform = 'rotate(-20deg) scale(1.3)'; p.style.animation = 'palm-wave 0.5s ease-in-out 3'; }, i * 100);
        });
        var hosana = document.getElementById('hosana-text');
        if (hosana) { hosana.style.opacity = '1'; hosana.style.transform = 'scale(1.5)'; hosana.style.animation = 'hosana-bounce 1s ease-in-out infinite'; }
        var donkey = document.querySelector('.jesus-on-donkey');
        if (donkey) donkey.style.animation = 'donkey-walk 2s ease-in-out forwards';
    },

    ceia: function() {
        var bread = document.getElementById('last-bread');
        var wine = document.getElementById('last-wine');
        if (bread && bread.classList.contains('done')) { bread.style.transform = 'scale(1.2)'; bread.style.filter = 'brightness(1.3) saturate(1.2)'; }
        if (wine && wine.classList.contains('done')) { wine.style.transform = 'scale(1.2)'; wine.style.filter = 'brightness(1.3) saturate(1.2)'; }
        var table = document.querySelector('.disciples-table');
        if (table) table.style.animation = 'disciples-eat 1s ease-in-out infinite';
    },

    getsemani: function() {
        var jesus = document.querySelector('.jesus-praying');
        if (jesus) { jesus.style.animation = 'jesus-peace 2s ease-in-out infinite'; }
        document.querySelectorAll('.prayer-drop.prayed').forEach(function(g) {
            g.style.opacity = '0';
            g.style.transform = 'translateY(-30px) scale(1.5)';
        });
    },

    cruz: function() {
        var heart = document.getElementById('love-heart');
        var cross = document.getElementById('cross-gentle');
        if (heart) { heart.style.animation = 'heart-grow 2s ease-in-out infinite'; heart.style.transform = 'scale(1.5)'; }
        if (cross) cross.style.boxShadow = '0 0 50px rgba(255,215,0,0.8)';
        var child = document.getElementById('child-prays');
        if (child) { child.style.animation = 'yoyo-pray 2s ease-in-out infinite'; child.style.filter = 'brightness(1.3) saturate(1.2)'; }
        for (var i = 0; i < 8; i++) setTimeout(criarRaioDeLuz, i * 250);
    },

    ressurreicao: function() {
        var stone = document.getElementById('stone');
        var jesus = document.getElementById('jesus-risen');
        var tomb = document.getElementById('tomb');
        if (stone) { stone.style.transition = 'all 2s ease-in-out'; stone.style.transform = 'translateX(150px) rotate(360deg)'; stone.style.opacity = '0.5'; }
        if (tomb) tomb.style.boxShadow = 'inset 0 0 40px rgba(255,215,0,0.8)';
        if (jesus) { jesus.style.opacity = '1'; jesus.style.transform = 'translateY(-60px) scale(1.2)'; jesus.style.animation = 'jesus-glow 2s ease-in-out infinite'; }
        var sun = document.querySelector('.sun-rise');
        if (sun) sun.style.animation = 'sun-rise-big 3s ease-in-out forwards';
        for (var i = 0; i < 10; i++) setTimeout(criarRaioDeLuz, i * 200);
    },

    ascensao: function() {
        var jesus = document.getElementById('jesus-ascend');
        if (jesus) {
            jesus.style.transition = 'all 4s ease-in-out';
            jesus.style.transform = 'translateY(-300px) scale(1.5)';
            jesus.style.animation = 'jesus-glow 2s ease-in-out infinite';
        }
        for (var i = 0; i < 15; i++) setTimeout(criarRaioDeLuz, i * 150);
    },

    promessa: function() {
        var jesus = document.getElementById('jesus-promessa');
        if (jesus) { jesus.style.animation = 'jesus-glow 2s ease-in-out infinite'; jesus.style.transform = 'scale(1.2)'; }
        for (var i = 0; i < 8; i++) setTimeout(criarRaioDeLuz, i * 200);
    },

    espera: function() {
        document.querySelectorAll('.praying-friend.done').forEach(function(p, i) {
            setTimeout(function() {
                p.style.transform = 'scale(1.2)';
                p.style.filter = 'brightness(1.3) saturate(1.2)';
            }, i * 200);
        });
        for (var i = 0; i < 6; i++) setTimeout(criarRaioDeLuz, i * 250);
    },

    pentecostes: function() {
        document.querySelectorAll('.fire-tongue.done').forEach(function(f, i) {
            setTimeout(function() {
                f.style.animation = 'fire-burst 1s ease-out';
                f.style.filter = 'brightness(1.5) saturate(1.5)';
            }, i * 150);
        });
        for (var i = 0; i < 10; i++) setTimeout(criarRaioDeLuz, i * 180);
    },

    consolador: function() {
        var heart = document.getElementById('coracao-consolador');
        if (heart) { heart.style.animation = 'heart-grow 2s ease-in-out infinite'; heart.style.transform = 'scale(1.3)'; }
        for (var i = 0; i < 10; i++) setTimeout(criarRaioDeLuz, i * 200);
    },

    frutos: function() {
        document.querySelectorAll('.fruit.done').forEach(function(f, i) {
            setTimeout(function() {
                f.style.transform = 'scale(1.3) translateY(-10px)';
                f.style.filter = 'brightness(1.3) saturate(1.3)';
            }, i * 150);
        });
        for (var i = 0; i < 8; i++) setTimeout(criarRaioDeLuz, i * 200);
    }
};

// ============================================
// ANIMAÇÕES AUXILIARES
// ============================================
function animarClicarMulti(el) {
    el.style.transform = 'scale(1.3) translateY(-15px)';
    el.style.transition = 'transform 0.3s';
}

function animarEncontrar(el) {
    el.style.opacity = '1';
    el.style.transform = 'scale(1.3)';
    el.style.transition = 'all 0.4s';
    el.style.animation = 'found-pop 0.6s ease-out';
}

function animarSequenciaOk(el, idx) {
    el.style.transform = 'scale(1.3)';
    el.style.opacity = '0.7';
    el.style.transition = 'all 0.3s';
    el.style.boxShadow = '0 0 20px rgba(255,215,0,0.8)';
}

function animarSequenciaErrada(el) {
    el.style.animation = 'shake 0.5s';
    setTimeout(function() { el.style.animation = ''; }, 500);
}

function animarArrastarOk(el, destino) {
    el.style.position = 'absolute';
    var destRect = destino.getBoundingClientRect();
    var parentRect = destino.parentElement.getBoundingClientRect();
    el.style.left = (destRect.left - parentRect.left + Math.random() * 30) + 'px';
    el.style.top = (destRect.top - parentRect.top + 20 + Math.random() * 20) + 'px';
    el.style.transform = 'scale(0.8)';
    el.style.transition = 'all 0.3s';
    el.style.animation = 'dropped-pop 0.5s ease-out';
}

function animarOrar(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-30px) scale(1.5)';
    el.style.transition = 'all 0.8s';
    criarRaioDeLuz();
}

function atualizarProgressoInteracao() {
    var progressEl = document.getElementById('interaction-progress');
    if (progressEl) {
        progressEl.textContent = estadoInteracao.progresso + ' / ' + estadoInteracao.total;
    }
}

// ============================================
// EFEITOS VISUAIS
// ============================================
function animarCoracoes() {
    var container = document.getElementById('scene-card');
    if (!container) return;
    for (var i = 0; i < 5; i++) {
        var heart = document.createElement('span');
        heart.className = 'heart-pop';
        heart.textContent = ['💖', '💛', '✨', '🌟', '💜'][i];
        heart.style.left = (15 + i * 18) + '%';
        heart.style.top = (20 + Math.random() * 20) + '%';
        container.appendChild(heart);
        (function(h) { setTimeout(function() { h.remove(); }, 1500); })(heart);
    }
}

function criarRaioDeLuz() {
    var container = document.getElementById('scene-card');
    if (!container) return;
    var ray = document.createElement('div');
    ray.className = 'light-ray';
    ray.style.left = (20 + Math.random() * 60) + '%';
    container.appendChild(ray);
    setTimeout(function() { ray.remove(); }, 2000);
}
