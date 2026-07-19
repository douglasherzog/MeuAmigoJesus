const fs = require('fs');
const path = require('path');
const https = require('https');

const MANIFESTO = path.join(__dirname, '..', 'assets', 'manifesto-imagens.json');
const CENAS = {
    anunciacao: 'a peaceful ancient Nazareth home with warm morning light, lilies and a simple wooden window',
    nascimento: 'a quiet Bethlehem stable at night with a manger, straw, lantern light and a bright starry sky',
    pastores: 'a moonlit hillside near Bethlehem with sheep, a small campfire and a deep blue starry sky',
    reismagos: 'a desert night journey with sand dunes, camel tracks and a brilliant guiding star',
    templosimeao: 'a reverent Jerusalem temple interior with stone columns, warm golden light and olive branches',
    templo12: 'an ancient Jerusalem temple study space with scrolls, stone columns and warm afternoon light',
    batismo: 'the calm Jordan River with green riverbanks, clear water, gentle sunlight and a wide blue sky',
    deserto: 'a peaceful Judean desert with warm dunes, distant rocks and a vast clear sky',
    discipulos: 'the Sea of Galilee shoreline with a wooden fishing boat, calm water and distant hills',
    cana: 'a joyful ancient Cana wedding courtyard with decorated tables, clay jars and soft festive lanterns',
    bemaventurancas: 'a serene green hillside overlooking Galilee with wildflowers, soft clouds and warm sunshine',
    curaciego: 'a welcoming ancient village street with sunlit stone homes, pottery and olive trees',
    paes: 'a spacious grassy hillside beside Galilee with woven baskets, bread, fish and a bright gentle sky',
    aguas: 'the Sea of Galilee during a dramatic night storm with rolling waves, moonlight and distant lightning',
    semeador: 'sunlit farmland with paths, rocky soil, thorny bushes and a rich fertile field',
    zaqueu: 'a lively ancient Jericho street with a large sycamore tree, stone homes and warm daylight',
    bomsamaritano: 'a dusty road between Jericho and Jerusalem with rocks, a distant inn and desert hills',
    jerusalem: 'Jerusalem city gates with palm branches on a bright welcoming street',
    ceia: 'an intimate upper room with a long wooden table, bread, cups, candles and warm evening light',
    getsemani: 'a quiet olive garden at night with moonlight, ancient trees and a peaceful blue sky',
    cruz: 'a solemn hill at dawn with a soft radiant sky and gentle distant hills',
    ressurreicao: 'a joyful garden at sunrise with an empty stone tomb, flowers and golden morning light',
    ascensao: 'a bright hilltop under open skies with soft clouds and glowing heavenly light',
    promessa: 'a peaceful hilltop with distant Jerusalem, soft clouds and warm promise-filled light',
    espera: 'a welcoming upper room with candles, wooden beams and calm morning light',
    pentecostes: 'an upper room filled with warm golden light, flowing air and joyful colorful atmosphere',
    consolador: 'a serene purple and pink abstract atmosphere with soft heart-shaped light and a dove-like glow',
    frutos: 'a vibrant green orchard with a fruit tree, soft sunshine, flowers and a peaceful blue sky'
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function baixarImagem(url, destino) {
    return new Promise((resolve, reject) => {
        const arquivo = fs.createWriteStream(destino);
        const requisicao = https.get(url, resposta => {
            if (resposta.statusCode === 301 || resposta.statusCode === 302) {
                arquivo.close();
                fs.unlinkSync(destino);
                baixarImagem(resposta.headers.location, destino).then(resolve, reject);
                return;
            }
            if (resposta.statusCode !== 200) {
                arquivo.close();
                fs.unlinkSync(destino);
                reject(new Error(`HTTP ${resposta.statusCode}`));
                return;
            }
            resposta.pipe(arquivo);
            arquivo.on('finish', () => arquivo.close(resolve));
        });
        requisicao.on('error', erro => {
            arquivo.close();
            if (fs.existsSync(destino)) fs.unlinkSync(destino);
            reject(erro);
        });
    });
}

function promptPara(item) {
    const cena = CENAS[item.fase];
    const semTexto = 'Absolutely no text anywhere: no letters, words, numbers, captions, labels, signs, books with writing, logos, watermarks, decorative glyphs or symbols resembling writing.';

    if (item.tipo === 'background') {
        return `Wide 16:9 children\'s storybook background illustration of ${cena}. Environmental scene only, leave clean open space for foreground game elements, no people or characters, soft pastel colors, cohesive biblical historical setting, detailed but uncluttered composition. ${semTexto}`;
    }

    return `Square children\'s storybook illustration of ${item.titulo} for a biblical scene set in ${cena}. Centered single subject, friendly rounded shapes, clear silhouette, soft pastel colors, simple uncluttered composition, no border and no frame. ${semTexto}`;
}

async function gerar(item, indice, total) {
    const destino = path.join(__dirname, '..', item.arquivo);
    const temporario = `${destino}.tmp`;
    const largura = item.tipo === 'background' ? 1024 : 512;
    const altura = item.tipo === 'background' ? 576 : 512;
    const prompt = promptPara(item);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${largura}&height=${altura}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true&model=flux`;

    console.log(`[${indice}/${total}] ${item.tipo === 'background' ? 'FUNDO' : 'SPRITE'}: ${item.arquivo}`);
    for (let tentativa = 1; tentativa <= 4; tentativa++) {
        try {
            if (fs.existsSync(temporario)) fs.unlinkSync(temporario);
            await baixarImagem(url, temporario);
            if (fs.statSync(temporario).size < 1000) throw new Error('Imagem muito pequena');
            fs.renameSync(temporario, destino);
            console.log(`  OK (${(fs.statSync(destino).size / 1024).toFixed(0)} KB)`);
            return true;
        } catch (erro) {
            if (fs.existsSync(temporario)) fs.unlinkSync(temporario);
            console.error(`  Erro ${tentativa}/4: ${erro.message}`);
            if (tentativa < 4) await sleep(tentativa * 10000);
        }
    }
    return false;
}

async function main() {
    const manifesto = JSON.parse(fs.readFileSync(MANIFESTO, 'utf8'));
    const itens = manifesto.imagens.filter(item => CENAS[item.fase]);
    let falhas = 0;

    console.log(`Regenerando ${itens.length} ilustrações contextuais sem tipografia.`);
    for (let i = 0; i < itens.length; i++) {
        if (!await gerar(itens[i], i + 1, itens.length)) falhas++;
        await sleep(5000);
    }
    console.log(`Concluído. Falhas: ${falhas}`);
    process.exitCode = falhas ? 1 : 0;
}

main().catch(erro => {
    console.error(erro);
    process.exit(1);
});
