// TTS - Text-to-Speech para o jogo Meu Amigo Jesus
// Ordem de prioridade: ElevenLabs (Cloudflare Worker) -> Servidor local -> Web Speech

var ELEVENLABS_PROXY_URL = 'https://meu-amigo-jesus-tts.workers.dev/falar';

var falando = false;
var aoTerminarFala = null;
var filaFalas = [];
var falaEmAndamento = false;

function bloquearInteracao() {
    falando = true;
    var overlay = document.getElementById('tts-overlay');
    if (overlay) overlay.classList.add('active');
}

function liberarInteracao() {
    falando = false;
    falaEmAndamento = false;
    var overlay = document.getElementById('tts-overlay');
    if (overlay) overlay.classList.remove('active');
    if (typeof aoTerminarFala === 'function') {
        var cb = aoTerminarFala;
        aoTerminarFala = null;
        cb();
    }
    processarProximaFala();
}

function selecionarVozPTBR() {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang.toLowerCase() === 'pt-br') ||
           voices.find(v => v.lang.toLowerCase().startsWith('pt')) ||
           voices[0];
}

function prepararTextoFalado(texto) {
    return texto.replace(/(\d+)\s*:\s*(\d+)/g, 'capítulo $1, versículo $2');
}

function falarWeb(texto) {
    if (!('speechSynthesis' in window)) {
        liberarInteracao();
        return false;
    }
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    const voz = selecionarVozPTBR();
    if (voz) msg.voice = voz;
    msg.lang = 'pt-BR';
    msg.rate = 0.9;
    msg.onend = function() { liberarInteracao(); };
    msg.onerror = function() { liberarInteracao(); };
    window.speechSynthesis.speak(msg);
    return true;
}

function tocarAudioBlob(blob) {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.onended = function() { liberarInteracao(); };
    audio.onerror = function() { liberarInteracao(); };
    audio.play().catch(err => {
        console.log('Erro ao tocar audio TTS:', err);
        document.addEventListener('click', function once() {
            audio.play();
            document.removeEventListener('click', once);
        }, { once: true });
    });
}

function falar(texto) {
    if (!texto) return;
    filaFalas.push(prepararTextoFalado(texto));
    processarProximaFala();
}

function processarProximaFala() {
    if (falaEmAndamento || !filaFalas.length) return;

    falaEmAndamento = true;
    bloquearInteracao();
    var texto = filaFalas.shift();
    const elevenUrl = ELEVENLABS_PROXY_URL + '?texto=' + encodeURIComponent(texto);
    fetch(elevenUrl)
        .then(response => {
            if (!response.ok) throw new Error('ElevenLabs proxy error: ' + response.status);
            return response.blob();
        })
        .then(blob => {
            tocarAudioBlob(blob);
        })
        .catch((err) => {
            console.log('ElevenLabs nao disponivel, tentando servidor local:', err);
            const localUrl = 'http://127.0.0.1:8766/falar?texto=' + encodeURIComponent(texto);
            fetch(localUrl)
                .then(response => {
                    if (!response.ok) throw new Error('Local TTS server error');
                    return response.blob();
                })
                .then(blob => {
                    tocarAudioBlob(blob);
                })
                .catch((err2) => {
                    console.log('Servidor local nao respondeu, usando Web Speech:', err2);
                    falarWeb(texto);
                });
        });
}

// Carregar vozes quando disponíveis
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = selecionarVozPTBR;
}
