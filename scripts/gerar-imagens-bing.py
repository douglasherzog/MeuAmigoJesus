import json
import os
import sys
import time
import urllib.request
from pathlib import Path

# Adiciona o pacote ao path se necessario
from BingImageCreator import ImageGen

MANIFESTO = Path(__file__).parent.parent / "assets" / "manifesto-imagens.json"
PHASES_JS = Path(__file__).parent.parent / "phases.js"


def ler_cookies(caminho):
    with open(caminho, "r", encoding="utf-8") as f:
        linhas = [linha.strip() for linha in f.read().strip().splitlines() if linha.strip()]
    if len(linhas) == 0:
        raise ValueError("Arquivo de cookie vazio")
    if len(linhas) == 1:
        return linhas[0], None
    return linhas[0], linhas[1]


def baixar_imagem(url, destino):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        with open(destino, "wb") as f:
            f.write(resp.read())


def atualizar_phases_js(gerados):
    texto = PHASES_JS.read_text(encoding="utf-8")
    for item in gerados:
        if item["tipo"] == "background":
            # Substitui fundo: null da fase correspondente
            padrao = f"id: '{item['fase']}',"
            if padrao not in texto:
                continue
            # Procura a proxima ocorrencia de imagens: { fundo: null
            inicio = texto.find(padrao)
            fim = texto.find("imagens:", inicio)
            if fim == -1:
                continue
            parte = texto[fim : fim + 200]
            nova_parte = parte.replace("fundo: null", f"fundo: '{item['arquivo']}'", 1)
            texto = texto[:fim] + nova_parte + texto[fim + 200 :]
        elif item["tipo"] == "sprite":
            chave = item["chave"].replace("-", "\\-")
            padrao = f"{item['chave']}': {{src:null"
            novo = f"{item['chave']}': {{src:'{item['arquivo']}'"
            texto = texto.replace(padrao, novo)
    PHASES_JS.write_text(texto, encoding="utf-8")


def main():
    if len(sys.argv) < 2:
        print("Uso: python scripts/gerar-imagens-bing.py <caminho-do-arquivo-com-cookies>")
        print("")
        print("Como obter os cookies:")
        print("1. Acesse https://www.bing.com/images/create no navegador")
        print("2. Faca login com sua conta Microsoft")
        print("3. Abra o DevTools (F12) -> Aplicacao/Storage -> Cookies -> https://www.bing.com")
        print("4. Copie os valores dos cookies '_U' e 'SRCHHPGUSR'")
        print("5. Salve ambos em um arquivo de texto, um por linha, e passe o caminho como argumento")
        sys.exit(1)

    cookie_path = Path(sys.argv[1])
    if not cookie_path.exists():
        print(f"Erro: arquivo nao encontrado: {cookie_path}")
        sys.exit(1)

    cookie_u, cookie_srch = ler_cookies(cookie_path)
    if cookie_srch is None:
        print("Erro: arquivo de cookie precisa conter '_U' na primeira linha e 'SRCHHPGUSR' na segunda linha.")
        sys.exit(1)

    print("Inicializando ImageGen com Bing Image Creator...")
    try:
        image_gen = ImageGen(auth_cookie=cookie_u, auth_cookie_SRCHHPGUSR=cookie_srch, quiet=True)
    except Exception as e:
        print(f"Erro ao inicializar ImageGen: {e}")
        sys.exit(1)

    with open(MANIFESTO, "r", encoding="utf-8") as f:
        manifesto = json.load(f)

    gerados = []
    falhos = []

    for i, item in enumerate(manifesto["imagens"], 1):
        destino = Path(__file__).parent.parent / item["arquivo"]
        destino.parent.mkdir(parents=True, exist_ok=True)

        if destino.exists():
            print(f"[{i}/{len(manifesto['imagens'])}] PULADO: {item['arquivo']}")
            gerados.append(item)
            continue

        print(f"[{i}/{len(manifesto['imagens'])}] GERANDO: {item['arquivo']}")
        try:
            urls = image_gen.get_images(item["prompt"])
            if not urls:
                raise Exception("Nenhuma URL retornada")
            baixar_imagem(urls[0], destino)
            print(f"   OK -> {destino}")
            gerados.append(item)
        except Exception as e:
            print(f"   ERRO: {e}")
            falhos.append({"item": item, "erro": str(e)})

        # Bing limita geracao; espera entre requests
        if i < len(manifesto["imagens"]):
            time.sleep(3)

    print("\n" + "=" * 50)
    print(f"Gerados: {len(gerados)}")
    print(f"Falhos: {len(falhos)}")

    if falhos:
        print("\nFalhas:")
        for f in falhos:
            print(f"  - {f['item']['arquivo']}: {f['erro']}")

    if gerados:
        atualizar_phases_js(gerados)
        print(f"\n{PHASES_JS.name} atualizado com {len(gerados)} caminhos.")


if __name__ == "__main__":
    main()
