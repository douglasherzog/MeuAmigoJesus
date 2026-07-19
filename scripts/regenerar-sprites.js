const fs = require('fs');
const path = require('path');
const https = require('https');

const MANIFESTO = path.join(__dirname, '..', 'assets', 'manifesto-imagens.json');

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
    const sprites = manifesto.imagens.filter(i => i.tipo === 'sprite');

    console.log(`Regenerando ${sprites.length} sprites com prompts sem texto...\n`);

    let ok = 0;
    let falhos = 0;

    for (let i = 0; i < sprites.length; i++) {
        const item = sprites[i];
        const destPath = path.join(__dirname, '..', item.arquivo);

        let prompt = item.prompt;
        if (!/no text/i.test(prompt)) {
            prompt += ', no text, no words, no letters, no writing, no captions, no labels, text-free image';
        }

        const encodedPrompt = encodeURIComponent(prompt);
        const width = 512;
        const height = 512;
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

        console.log(`[${i + 1}/${sprites.length}] REGERANDO: ${item.arquivo}`);
        let sucesso = false;
        for (let tentativa = 1; tentativa <= 4; tentativa++) {
            try {
                if (tentativa > 1) {
                    const espera = 10000 * tentativa;
                    console.log(`   Retry ${tentativa}/4 (aguardando ${(espera / 1000).toFixed(0)}s)...`);
                    await sleep(espera);
                }
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                await baixarImagem(url, destPath);
                const size = fs.statSync(destPath).size;
                if (size < 1000) throw new Error('Imagem muito pequena, possivel erro');
                console.log(`   OK (${(size / 1024).toFixed(0)} KB)`);
                sucesso = true;
                ok++;
                break;
            } catch (err) {
                console.error(`   ERRO (tentativa ${tentativa}): ${err.message}`);
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            }
        }
        if (!sucesso) {
            console.error(`   FALHOU: ${item.arquivo}`);
            falhos++;
        }

        await sleep(5000);
    }

    console.log(`\nConcluido! OK: ${ok}, Falhos: ${falhos}`);
}

main().catch(err => { console.error(err); process.exit(1); });
