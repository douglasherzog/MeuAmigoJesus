# Assets Visuais - Meu Amigo Jesus

Esta pasta contém os recursos visuais do jogo. Para usar imagens em vez de emojis, basta colocar os arquivos nas pastas correspondentes e referenciá-los no arquivo `phases.js` no campo `imagens` de cada fase.

## Estrutura

```
assets/
├── backgrounds/    # Fundos dos cenários (fase-XX-bg.jpg ou .png)
├── characters/     # Personagens principais (jesus, maria, anjo, etc.)
├── objects/        # Objetos interativos (estrela, peixe, cruz, etc.)
└── ui/             # Elementos da interface (botões, partículas, etc.)
```

## Nomenclatura recomendada

### Cenários (fundo)
- `fase-XX-bg.png` — fundo da fase (ex: `fase-01-bg.png`)
- `fase-XX-bg-historia.png` — fundo da etapa de história (opcional, sem elementos interativos)

### Personagens
- `jesus-adulto.png`
- `jesus-crianca.png`
- `maria.png`
- `anjo-gabriel.png`
- `reis-magos.png`
- `pastores.png`
- `pescadores.png`
- `espirito-santo.png` (pomba com brilho)

### Objetos
- `estrela.png`
- `cruz.png`
- `tumba.png`
- `coração.png`
- `fogo-pentecostes.png`

## Como ativar imagens em uma fase

No `phases.js`, adicione o campo `imagens`:

```js
{
    id: 'anunciacao',
    numero: 1,
    ...
    imagens: {
        fundo: 'assets/backgrounds/fase-01-bg.png',
        fundoHistoria: 'assets/backgrounds/fase-01-bg-historia.png',
        personagens: {
            anjo: { src: 'assets/characters/anjo-gabriel.png', width: '120px', bottom: '20%', left: '60%' },
            maria: { src: 'assets/characters/maria.png', width: '100px', bottom: '15%', left: '20%' }
        },
        objetos: {
            lily: { src: 'assets/objects/flor-liz.png', width: '60px', bottom: '10%', left: '45%' }
        }
    },
    ...
}
```

Se o campo `imagens` não existir ou uma imagem não for encontrada, o jogo usa automaticamente os emojis e CSS já existentes (fallback).

## Formatos recomendados

- **PNG** com transparência para personagens e objetos
- **WebP** para fundos (menor tamanho, melhor performance)
- Tamanho máximo recomendado: 1920x1080 para fundos, 512x512 para personagens
- Use nomes em minúsculas, sem acentos e sem espaços.
