const fs = require('fs');
const path = require('path');
const https = require('https');

const manifestPath = path.join(__dirname, '..', 'assets', 'manifesto-imagens.json');
const phasesPath = path.join(__dirname, '..', 'phases.js');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error('Erro: defina a variável de ambiente OPENAI_API_KEY.');
    console.error('Exemplo no PowerShell: $env:OPENAI_API_KEY="sk-..."');
    process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
    console.error('Erro: manifesto não encontrado. Execute primeiro: node scripts/gerar-manifesto.js');
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', reject);
    });
}

async function generateImage(prompt, destPath) {
    const body = JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: destPath.endsWith('.webp') ? '1792x1024' : '1024x1024',
        response_format: 'url'
    });

    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'api.openai.com',
            path: '/v1/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Length': Buffer.byteLength(body)
            }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) {
                        reject(new Error(json.error.message));
                        return;
                    }
                    resolve(json.data[0].url);
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function main() {
    const gerados = [];
    const falhos = [];

    for (const item of manifest.imagens) {
        const destPath = path.join(__dirname, '..', item.arquivo);
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // Pula se já existe
        if (fs.existsSync(destPath)) {
            console.log(`[PULADO] ${item.arquivo}`);
            gerados.push(item);
            continue;
        }

        try {
            console.log(`[GERANDO] ${item.arquivo}`);
            const url = await generateImage(item.prompt, destPath);
            await downloadImage(url, destPath);
            console.log(`[OK] ${item.arquivo}`);
            gerados.push(item);
        } catch (err) {
            console.error(`[ERRO] ${item.arquivo}: ${err.message}`);
            falhos.push({ item, erro: err.message });
        }

        // Evita rate limit
        await sleep(500);
    }

    // Atualiza phases.js com os caminhos gerados
    if (gerados.length > 0) {
        let phasesSrc = fs.readFileSync(phasesPath, 'utf8');

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

        fs.writeFileSync(phasesPath, phasesSrc, 'utf8');
        console.log(`\n phases.js atualizado com ${gerados.length} caminhos de imagem.`);
    }

    console.log(`\nResumo:`);
    console.log(`  Gerados/pulados: ${gerados.length}`);
    console.log(`  Falhos: ${falhos.length}`);
    if (falhos.length > 0) {
        console.log('  Falhas:');
        falhos.forEach(f => console.log(`    - ${f.item.arquivo}: ${f.erro}`));
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
