// MUSIC - Música de fundo suave gerada com Web Audio API
// Melodia calma e alegre inspirada em hinos infantis

var audioCtx = null;
var musicaAtiva = false;
var musicaTimer = null;
var volumeMusica = 0.08;

// Notas em Hz (escala de Dó maior)
var NOTAS = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
    'G5': 783.99, 'A5': 880.00
};

// Melodia simples e calma (notas com duracao em segundos)
var MELODIA = [
    ['E4', 0.5], ['G4', 0.5], ['C5', 0.5], ['G4', 0.5],
    ['E4', 0.5], ['G4', 0.5], ['C5', 0.75], ['A4', 0.25],
    ['F4', 0.5], ['A4', 0.5], ['D5', 0.5], ['A4', 0.5],
    ['F4', 0.5], ['A4', 0.5], ['D5', 0.75], ['G4', 0.25],
    ['E4', 0.5], ['G4', 0.5], ['C5', 0.5], ['E5', 0.5],
    ['D5', 0.5], ['C5', 0.5], ['G4', 0.5], ['E4', 0.5],
    ['F4', 0.5], ['E4', 0.5], ['D4', 0.5], ['E4', 0.5],
    ['C4', 1.0]
];

// Acorde de acompanhamento (baixo suave)
var BAIXO = [
    ['C4', 2.0], ['F4', 2.0], ['G4', 2.0], ['C4', 2.0],
    ['C4', 2.0], ['F4', 2.0], ['G4', 1.0], ['C4', 1.0]
];

function initAudioCtx() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('AudioContext nao suportado', e);
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function tocarNota(freq, duracao, tipo, vol) {
    if (!audioCtx) return;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = tipo || 'sine';
    osc.frequency.value = freq;
    var agora = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, agora);
    gain.gain.linearRampToValueAtTime(vol || volumeMusica, agora + 0.05);
    gain.gain.linearRampToValueAtTime(0, agora + duracao);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(agora);
    osc.stop(agora + duracao + 0.1);
}

function tocarMelodia() {
    var tempoTotal = 0;
    MELODIA.forEach(function(nota) {
        var freq = NOTAS[nota[0]];
        if (freq) {
            setTimeout(function() {
                tocarNota(freq, nota[1] * 0.9, 'triangle', volumeMusica * 0.7);
            }, tempoTotal * 1000);
        }
        tempoTotal += nota[1];
    });

    // Baixo de acompanhamento
    var tempoBaixo = 0;
    BAIXO.forEach(function(nota) {
        var freq = NOTAS[nota[0]] * 0.5;
        if (freq) {
            setTimeout(function() {
                tocarNota(freq, nota[1] * 0.95, 'sine', volumeMusica * 0.4);
            }, tempoBaixo * 1000);
        }
        tempoBaixo += nota[1];
    });

    // Agenda a proxima repeticao
    musicaTimer = setTimeout(tocarMelodia, tempoTotal * 1000 + 500);
}

function iniciarMusica() {
    initAudioCtx();
    if (!audioCtx || musicaAtiva) return;
    musicaAtiva = true;
    tocarMelodia();
}

function pararMusica() {
    musicaAtiva = false;
    if (musicaTimer) {
        clearTimeout(musicaTimer);
        musicaTimer = null;
    }
}

function alternarMusica() {
    if (musicaAtiva) {
        pararMusica();
    } else {
        iniciarMusica();
    }
    return musicaAtiva;
}

// ============================================
// EFEITOS SONOROS POR FASE
// ============================================

function tocarEfeitoFase(cenarioId) {
    initAudioCtx();
    if (!audioCtx) return;
    var efeitos = {
        'anunciacao': efeitoBrilho,
        'nascimento': efeitoEstrela,
        'pastores': efeitoSinoSuave,
        'reismagos': efeitoMagia,
        'templo': efeitoTemplo,
        'templo12': efeitoPagina,
        'batismo': efeitoAgua,
        'deserto': efeitoVento,
        'pescadores': efeitoOnda,
        'cana': efeitoAgua,
        'monte': efeitoBrilho,
        'curaciego': efeitoCura,
        'paes': efeitoSuave,
        'aguas': efeitoTempestade,
        'semeador': efeitoSuave,
        'zaqueu': efeitoSuave,
        'bomsamaritano': efeitoSuave,
        'jerusalem': efeitoAplauso,
        'ceia': efeitoSuave,
        'getsemani': efeitoVento,
        'cruz': efeitoSolene,
        'ressurreicao': efeitoTriunfo,
        'ascensao': efeitoAscensao,
        'promessa': efeitoPromessa,
        'espera': efeitoEspera,
        'pentecostes': efeitoPentecostes,
        'consolador': efeitoConsolador,
        'frutos': efeitoFrutos
    };
    var fn = efeitos[cenarioId];
    if (fn) setTimeout(fn, 300);
}

// Brilho angelical (arpejo agudo)
function efeitoBrilho() {
    var notas = [659.25, 783.99, 987.77, 1318.51];
    notas.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.4, 'triangle', 0.06); }, i * 120);
    });
}

// Estrela cintilante (notas altas em glissando)
function efeitoEstrela() {
    var freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.3, 'sine', 0.05); }, i * 100);
    });
}

// Sino suave
function efeitoSinoSuave() {
    tocarNota(523.25, 1.2, 'sine', 0.08);
    setTimeout(function() { tocarNota(659.25, 1.0, 'sine', 0.06); }, 200);
}

// Magia (arpejo mistico)
function efeitoMagia() {
    var notas = [440, 554.37, 659.25, 880, 1108.73];
    notas.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.5, 'triangle', 0.05); }, i * 150);
    });
}

// Templo (acorde grave e solene)
function efeitoTemplo() {
    tocarNota(130.81, 1.5, 'sine', 0.07);
    setTimeout(function() { tocarNota(196.00, 1.3, 'sine', 0.05); }, 100);
    setTimeout(function() { tocarNota(261.63, 1.0, 'sine', 0.04); }, 200);
}

// Pagina virando (ruido curto)
function efeitoPagina() {
    if (!audioCtx) return;
    var buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3 * (1 - i / data.length);
    }
    var src = audioCtx.createBufferSource();
    var gain = audioCtx.createGain();
    gain.gain.value = 0.08;
    src.buffer = buffer;
    src.connect(gain);
    gain.connect(audioCtx.destination);
    src.start();
}

// Agua (ruido filtrado - splash)
function efeitoAgua() {
    if (!audioCtx) return;
    var buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.6, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
        var env = Math.sin(Math.PI * i / data.length);
        data[i] = (Math.random() * 2 - 1) * env * 0.5;
    }
    var src = audioCtx.createBufferSource();
    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    var gain = audioCtx.createGain();
    gain.gain.value = 0.1;
    src.buffer = buffer;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    src.start();
}

// Vento (ruido filtrado grave e longo)
function efeitoVento() {
    if (!audioCtx) return;
    var buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2.0, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
        var env = Math.sin(Math.PI * i / data.length);
        data[i] = (Math.random() * 2 - 1) * env;
    }
    var src = audioCtx.createBufferSource();
    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    var gain = audioCtx.createGain();
    gain.gain.value = 0.06;
    src.buffer = buffer;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    src.start();
}

// Onda do mar (agua mais longa)
function efeitoOnda() {
    if (!audioCtx) return;
    var buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 1.5, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
        var env = Math.sin(Math.PI * i / data.length);
        data[i] = (Math.random() * 2 - 1) * env * 0.4;
    }
    var src = audioCtx.createBufferSource();
    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    var gain = audioCtx.createGain();
    gain.gain.value = 0.08;
    src.buffer = buffer;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    src.start();
}

// Cura (acorde crescente suave)
function efeitoCura() {
    var notas = [261.63, 329.63, 392.00, 523.25];
    notas.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.8, 'sine', 0.05); }, i * 200);
    });
}

// Som suave generico (acorde curto)
function efeitoSuave() {
    tocarNota(392.00, 0.5, 'sine', 0.05);
    setTimeout(function() { tocarNota(523.25, 0.5, 'sine', 0.04); }, 150);
}

// Tempestade (rudo + trovao)
function efeitoTempestade() {
    efeitoVento();
    setTimeout(function() {
        if (!audioCtx) return;
        var buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.8, audioCtx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < data.length; i++) {
            var env = Math.pow(1 - i / data.length, 2);
            data[i] = (Math.random() * 2 - 1) * env;
        }
        var src = audioCtx.createBufferSource();
        var filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        var gain = audioCtx.createGain();
        gain.gain.value = 0.15;
        src.buffer = buffer;
        src.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        src.start();
    }, 500);
}

// Aplauso (varios ruidos curtos)
function efeitoAplauso() {
    if (!audioCtx) return;
    for (var n = 0; n < 8; n++) {
        (function(idx) {
            setTimeout(function() {
                var buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.08, audioCtx.sampleRate);
                var data = buffer.getChannelData(0);
                for (var i = 0; i < data.length; i++) {
                    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
                }
                var src = audioCtx.createBufferSource();
                var gain = audioCtx.createGain();
                gain.gain.value = 0.04;
                src.buffer = buffer;
                src.connect(gain);
                gain.connect(audioCtx.destination);
                src.start();
            }, idx * 120);
        })(n);
    }
}

// Solene (acorde grave e longo)
function efeitoSolene() {
    tocarNota(130.81, 2.0, 'sine', 0.08);
    setTimeout(function() { tocarNota(196.00, 1.8, 'sine', 0.06); }, 200);
    setTimeout(function() { tocarNota(261.63, 1.5, 'sine', 0.05); }, 400);
}

// Triunfo (fanfarra alegre)
function efeitoTriunfo() {
    var notas = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    notas.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.3, 'triangle', 0.07); }, i * 150);
    });
}

// Ascensao (tom que sobe gradualmente)
function efeitoAscensao() {
    var freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    freqs.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.4, 'sine', 0.06); }, i * 200);
    });
}

// Promessa do Consolador (acorde suave e caloroso)
function efeitoPromessa() {
    tocarNota(349.23, 1.0, 'sine', 0.06);
    setTimeout(function() { tocarNota(440.00, 1.0, 'sine', 0.05); }, 200);
    setTimeout(function() { tocarNota(523.25, 1.2, 'sine', 0.04); }, 400);
    setTimeout(function() { tocarNota(659.25, 0.8, 'triangle', 0.05); }, 600);
}

// Espera em oracao (notas serenas e contemplativas)
function efeitoEspera() {
    var notas = [261.63, 329.63, 392.00, 329.63, 261.63];
    notas.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.8, 'sine', 0.05); }, i * 400);
    });
}

// Pentecostes (vento forte + fogo - dramático e poderoso)
function efeitoPentecostes() {
    efeitoVento();
    setTimeout(function() {
        var notas = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        notas.forEach(function(f, i) {
            setTimeout(function() { tocarNota(f, 0.5, 'triangle', 0.08); }, i * 100);
        });
    }, 500);
}

// Consolador no coracao (acorde caloroso e envolvente)
function efeitoConsolador() {
    tocarNota(261.63, 1.5, 'sine', 0.06);
    setTimeout(function() { tocarNota(329.63, 1.3, 'sine', 0.05); }, 150);
    setTimeout(function() { tocarNota(392.00, 1.2, 'sine', 0.05); }, 300);
    setTimeout(function() { tocarNota(523.25, 1.0, 'sine', 0.04); }, 450);
    setTimeout(function() { tocarNota(659.25, 0.8, 'triangle', 0.04); }, 600);
}

// Frutos do Espirito (arpejo alegre e crescente)
function efeitoFrutos() {
    var notas = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    notas.forEach(function(f, i) {
        setTimeout(function() { tocarNota(f, 0.3, 'triangle', 0.05); }, i * 120);
    });
}
