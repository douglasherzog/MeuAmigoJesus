// TTS - Text-to-Speech para o jogo Meu Amigo Jesus

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
    if (!('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    const voz = selecionarVozPTBR();
    if (voz) msg.voice = voz;
    msg.lang = 'pt-BR';
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
    return true;
}

function falar(texto) {
    if (!texto) return;
    texto = prepararTextoFalado(texto);
    const url = `http://127.0.0.1:8766/falar?texto=${encodeURIComponent(texto)}`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('TTS server error');
            return response.blob();
        })
        .then(blob => {
            const audio = new Audio(URL.createObjectURL(blob));
            audio.play().catch(err => {
                console.log('Erro ao tocar audio TTS:', err);
                document.addEventListener('click', function once() {
                    audio.play();
                    document.removeEventListener('click', once);
                }, { once: true });
            });
        })
        .catch((err) => {
            console.log('TTS server nao respondeu, usando Web Speech:', err);
            falarWeb(texto);
        });
}

// Carregar vozes quando disponíveis
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = selecionarVozPTBR;
}
