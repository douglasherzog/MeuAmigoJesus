const fs = require('fs');
const https = require('https');

const OPENAI_API_KEY = process.argv[2]
    ? fs.readFileSync(process.argv[2], 'utf8').trim()
    : process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('Defina OPENAI_API_KEY ou passe o caminho de um arquivo com a chave');
    process.exit(1);
}

const body = JSON.stringify({
    model: 'dall-e-2',
    prompt: 'Cute children\'s book illustration of a smiling angel with white wings, soft pastel colors, transparent background, PNG cutout, no text',
    n: 1,
    size: '1024x1024'
});

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
        if (!data) {
            console.error('Resposta vazia. Status HTTP:', res.statusCode);
            process.exit(1);
        }
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('Erro da API:', json.error.message);
                process.exit(1);
            }
            console.log('OK! URL gerada:', json.data[0].url);
        } catch (e) {
            console.error('Erro ao parsear resposta (HTTP ' + res.statusCode + '):', data);
            process.exit(1);
        }
    });
});

req.on('error', err => {
    console.error('Erro de requisicao:', err.message);
    process.exit(1);
});

req.write(body);
req.end();
