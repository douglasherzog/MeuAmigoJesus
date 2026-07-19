const fs = require('fs');
const path = require('path');

const phasesPath = path.join(__dirname, '..', 'phases.js');
const promptsPath = path.join(__dirname, '..', 'assets', 'prompts-ia.md');
const manifestPath = path.join(__dirname, '..', 'assets', 'manifesto-imagens.json');

// Lê e executa o phases.js para obter FASES
const phasesSrc = fs.readFileSync(phasesPath, 'utf8');
const FASES = eval(phasesSrc.replace(/const FASES =/, '').split('const MEDALHAS')[0]);

// Lê os prompts existentes para reutilizar quando possível
const promptsText = fs.readFileSync(promptsPath, 'utf8');
const promptMap = {};
const bgRegex = /### FASE \d+ — ([^\n]+)\n`([^`]+)`/g;
let m;
while ((m = bgRegex.exec(promptsText)) !== null) {
    const titulo = normalizarTitulo(m[1]);
    promptMap[titulo] = m[2].trim();
}

function slugify(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizarTitulo(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/^\s*(a|o|as|os)\s+/i, '')
        .trim();
}

const manifest = {
    geradoEm: new Date().toISOString(),
    instrucoes: 'Preencha OPENAI_API_KEY e execute scripts/gerar-imagens.js para gerar as imagens automaticamente.',
    imagens: []
};

FASES.forEach(fase => {
    const idSlug = slugify(fase.titulo);
    const tituloNorm = normalizarTitulo(fase.titulo);

    // Fundo do cenário
    if (fase.imagens && fase.imagens.fundo !== undefined) {
        const bgPrompt = promptMap[tituloNorm] ||
            `Cute children's book illustration background scene for "${fase.titulo}", soft warm pastel colors, gentle lighting, rounded friendly shapes, storybook art style, wide scene background, no characters, no text, no watermark`;
        manifest.imagens.push({
            tipo: 'background',
            fase: fase.id,
            titulo: fase.titulo,
            arquivo: `assets/backgrounds/${fase.id}-bg.webp`,
            prompt: bgPrompt
        });
    }

    // Elementos do mapa
    const mapa = fase.imagens && fase.imagens.mapa ? fase.imagens.mapa : {};
    Object.keys(mapa).forEach(chave => {
        const config = mapa[chave];
        const tituloEl = config.titulo || chave;
        manifest.imagens.push({
            tipo: 'sprite',
            fase: fase.id,
            chave: chave,
            titulo: tituloEl,
            arquivo: `assets/sprites/${chave}.png`,
            prompt: `Cute children's book illustration of "${tituloEl}" from the Bible story "${fase.titulo}", soft warm pastel colors, gentle lighting, rounded friendly shapes, storybook art style, transparent background, PNG cutout, single isolated element, no text, no watermark`
        });
    });
});

// Cria diretórios se não existirem
['assets/backgrounds', 'assets/sprites'].forEach(dir => {
    const fullDir = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Manifesto gerado com ${manifest.imagens.length} imagens:`);
console.log(`  - Backgrounds: ${manifest.imagens.filter(i => i.tipo === 'background').length}`);
console.log(`  - Sprites: ${manifest.imagens.filter(i => i.tipo === 'sprite').length}`);
console.log(`Arquivo salvo em: ${manifestPath}`);
