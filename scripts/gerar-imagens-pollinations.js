const fs = require('fs');
const path = require('path');
const https = require('https');

const MANIFESTO = path.join(__dirname, '..', 'assets', 'manifesto-imagens.json');
const PHASES_JS = path.join(__dirname, '..', 'phases.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function baixarImagem(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, resp => {
            if (resp.statusCode === 302 || resp.statusCode === 301) {
                https.get(resp.headers.location, resp2 => {
                    if (resp2.statusCode !== 200) {
                        reject(new Error(`HTTP ${resp2.statusCode}`));
                        return;
                    }
                    resp2.pipe(file);
                    file.on('finish', () => { file.close(); resolve(); });
                }).on('error', reject);
                return;
            }
            if (resp.statusCode !== 200) {
                reject(new Error(`HTTP ${resp.statusCode}`));
                return;
            }
            resp.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
    });
}

async function main() {
    const manifesto = JSON.parse(fs.readFileSync(MANIFESTO, 'utf8'));
    const gerados = [];
    const falhos = [];

    for (let i = 0; i < manifesto.imagens.length; i++) {
        const item = manifesto.imagens[i];
        const destPath = path.join(__dirname, '..', item.arquivo);
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        if (fs.existsSync(destPath)) {
            console.log(`[${i + 1}/${manifesto.imagens.length}] PULADO: ${item.arquivo}`);
            gerados.push(item);
            continue;
        }

        const encodedPrompt = encodeURIComponent(item.prompt);
        const isBg = item.tipo === 'background';
        const width = isBg ? 1024 : 512;
        const height = isBg ? 576 : 512;
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

        console.log(`[${i + 1}/${manifesto.imagens.length}] GERANDO: ${item.arquivo}`);
        let sucesso = false;
        for (let tentativa = 1; tentativa <= 4; tentativa++) {
            try {
                if (tentativa > 1) {
                    const espera = 10000 * tentativa;
                    console.log(`   Retry ${tentativa}/4 (aguardando ${(espera / 1000).toFixed(0)}s)...`);
                    await sleep(espera);
                }
                await baixarImagem(url, destPath);
                const size = fs.statSync(destPath).size;
                if (size < 1000) throw new Error('Imagem muito pequena, possivel erro');
                console.log(`   OK (${(size / 1024).toFixed(0)} KB)`);
                gerados.push(item);
                sucesso = true;
                break;
            } catch (err) {
                console.error(`   ERRO (tentativa ${tentativa}): ${err.message}`);
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            }
        }
        if (!sucesso) {
            falhos.push({ item, erro: 'Falhou apos 4 tentativas' });
        }

        await sleep(5000);
    }

    if (gerados.length > 0) {
        let phasesSrc = fs.readFileSync(PHASES_JS, 'utf8');
        gerados.forEach(item => {
            if (item.tipo === 'background') {
                const regex = new RegExp(`(id:\\s*'${item.fase}',[\\s\\S]*?imagens:\\s*\\{[^\\}]*?fundo:\\s*)null`, 'g');
                phasesSrc = phasesSrc.replace(regex, `$1'${item.arquivo.replace(/\\/g, '/')}'`);
            } else if (item.tipo === 'sprite') {
                const escapedChave = item.chave.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                const regex = new RegExp(`(${escapedChave}':\\s*\\{src:)null`, 'g');
                phasesSrc = phasesSrc.replace(regex, `$1'${item.arquivo.replace(/\\/g, '/')}'`);
            }
        });
        fs.writeFileSync(PHASES_JS, phasesSrc, 'utf8');
        console.log(`\nphases.js atualizado com ${gerados.length} caminhos.`);
    }

    console.log(`\nResumo:`);
    console.log(`  Gerados: ${gerados.length}`);
    console.log(`  Falhos: ${falhos.length}`);
    if (falhos.length > 0) {
        console.log('  Falhas:');
        falhos.forEach(f => console.log(`    - ${f.item.arquivo}: ${f.erro}`));
    }
}

main().catch(err => { console.error(err); process.exit(1); });
