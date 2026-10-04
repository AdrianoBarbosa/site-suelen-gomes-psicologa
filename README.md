# suelengomes.com.br

Site de Suelen Gomes da Silva Olivares, psicóloga clínica com abordagem psicanalítica em Limeira, SP (CRP 06/153831).

**Site:** https://suelengomes.com.br

## Como funciona

- React 19 via CDN ([esm.sh](https://esm.sh)) com import map e [htm](https://github.com/developit/htm) no lugar do JSX. Sem Node.js, bundler ou build: é HTML, CSS e JavaScript estático.
- Modo claro, escuro ou sistema, escolhido pelo visitante e salvo no navegador. O logo tem uma versão clara para o modo escuro.
- Publicado pelo GitHub Pages direto da branch `main`, no domínio do arquivo `CNAME`.

## Estrutura

```
index.html              página, import map e aplicação do tema antes do primeiro paint
assets/css/styles.css   estilos, todos baseados nas variáveis da paleta
assets/js/config.js     configuração interna: paleta ativa e dados de contato
assets/js/themes.js     paletas de cores (variantes claro e escuro)
assets/js/content.js    todos os textos do site
assets/js/app.js        componentes React
assets/img/             logo (claro e escuro)
img/                    favicon e imagem de compartilhamento (caminhos mantidos do site antigo)
CNAME                   domínio suelengomes.com.br
```

## Paletas

A paleta ativa fica em `assets/js/config.js`, na chave `palette`. Não há seletor na interface. Opções:

`suelen` (padrão, identidade visual em bege, azul-marinho e dourado), `salvia`, `terracota`, `lavanda`

## Editando textos

Os textos ficam em `assets/js/content.js`. Ao editar, vale manter os cuidados de publicidade do Código de Ética do CFP: nome e CRP visíveis, sem promessa de resultados, sem depoimentos de pacientes e sem preços como promoção.

## Rodando localmente

```bash
python3 -m http.server 8000
```

## Backup do site anterior

A versão original está na tag `site-original-2026-10-04` e na branch `backup/site-original`.
