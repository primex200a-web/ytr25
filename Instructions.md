# Guia de Modificação - YouTube Rewards Quiz

## 1. Alterando Vídeos das Etapas 1-3 (iframes)

### Localização: `index.html` - Linhas 33-49

Para alterar os vídeos das etapas 1, 2 e 3, você precisa modificar os códigos de embed dos iframes:

#### Vídeo 1 (Etapa 1):
```html
<!-- Linha ~33 -->
<div id="video1" style="display: block;">
    <iframe ... onload="this.src='https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/68d86315096c154d172072d0/v4/embed.html'..."></iframe>
</div>
```

#### Vídeo 2 (Etapa 2):
```html
<!-- Linha ~38 -->
<div id="video2" style="display: none;">
    <iframe ... onload="this.src='https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/68d8631e8b982964e6519e10/v4/embed.html'..."></iframe>
</div>
```

#### Vídeo 3 (Etapa 3):
```html
<!-- Linha ~43 -->
<div id="video3" style="display: none;">
    <iframe ... onload="this.src='https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/68d86326a4bea31e50e76207/v4/embed.html'..."></iframe>
</div>
```

---

## 2. Alterando VSL (Vídeo da Etapa 4)

### Localização: `index.html` - Linha 48 e `js/simple-quiz.js` - Linha 98

#### No HTML:
```html
<!-- Linha ~48 -->
<div id="vsl" style="display: none;" data-script-src="https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/68d8628f232c1a965f3c9395/v4/player.js">
    <vturb-smartplayer id="vid-68d8628f232c1a965f3c9395" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/68d8628f232c1a965f3c9395/v4/player.js", s.async=!0,document.head.appendChild(s); </script>
</div>
```

#### No JavaScript:
```javascript
// Linha ~98 em js/simple-quiz.js
function loadVideoScript(type) {
    let scriptSrc = '';
    
    if (type === 'vsl') {
        scriptSrc = 'https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/68d8628f232c1a965f3c9395/v4/player.js';
        // ...
    }
}
```

**Para trocar o VSL:**
1. Substitua o ID do player em ambos os locais: `68d8628f232c1a965f3c9395`
2. Mantenha a estrutura das URLs, apenas mude o ID

---

## 3. Alterando o Delay do VSL

### Localização: `js/simple-quiz.js` - Linha 109

```javascript
// Linha ~109
script.onload = () => {
    setTimeout(() => {
        const player = document.querySelector('vturb-smartplayer');
        if (player) {
            player.addEventListener('player:ready', () => {
                const delaySeconds = 530; // ← ALTERE AQUI
                player.displayHiddenElements(delaySeconds, [".esconder"], {persist: true});
            });
        }
    }, 500);
};
```

**Para alterar o delay:**
- Modifique o valor de `delaySeconds = 530` para o tempo desejado em segundos
- Exemplo: `delaySeconds = 10` para 10 segundos de delay

---

## 4. Alterando Link de Checkout

### Localização: `index.html` - Linha 115

```html
<!-- Linha ~115 -->
<div class="payment-section esconder" id="payment-section">
    <a class="payment-btn" id="payment-btn" href="https://google.com" target="_blank">
        I WANT TO PAY THE ACCESS
    </a>
</div>
```

**Para alterar o link:**
- Substitua `href="https://google.com"` pelo link desejado
- Exemplo: `href="https://checkout.stripe.com/pay/cs_test_..."`

**Para alterar o texto do botão:**
- Modifique o texto entre as tags `<a>`: `I WANT TO PAY THE ACCESS`

---

## 5. Informações dos Vídeos (Títulos e Canais)

### Localização: `index.html` - Linhas 54-95

Para alterar as informações que aparecem abaixo dos vídeos:

#### Vídeo 1:
```html
<!-- Linha ~56 -->
<div class="video-info" id="step1-video-info">
    <h3 class="video-title">Burgerville Big Sassy Cheeseburger</h3>
    <p class="video-views">251K views - 4 days ago</p>
    <div class="channel-info">
        <img src="assets/burguerville.webp" alt="Burgerville" class="channel-avatar" />
        <span class="channel-name">Burgerville</span>
    </div>
</div>
```

#### Vídeo 2:
```html
<!-- Linha ~70 -->
<div class="video-info" id="step2-video-info">
    <h3 class="video-title">Always Ultra Thin – Fear No Gush</h3>
    <p class="video-views">1.1M views - 15 days ago</p>
    <div class="channel-info">
        <img src="assets/always.webp" alt="Always" class="channel-avatar" />
        <span class="channel-name">Always</span>
    </div>
</div>
```

#### Vídeo 3:
```html
<!-- Linha ~84 -->
<div class="video-info" id="step3-video-info">
    <h3 class="video-title">Losing is Hard</h3>
    <p class="video-views">45K views - 2 days ago</p>
    <div class="channel-info">
        <img src="assets/xumo.webp" alt="Xumo" class="channel-avatar" />
        <span class="channel-name">Xumo</span>
    </div>
</div>
```

---

## 6. Título do VSL

### Localização: `index.html` - Linha 99

```html
<!-- Linha ~99 -->
<div class="vsl-title" id="vsl-title" style="display: none;">
    <h2><b>Secret Microtasks:</b> Earned money by watching videos? To cash out and complete more microtasks, watch this 4-minute tutorial.</h2>
</div>
```

**Para alterar:** Modifique o texto dentro da tag `<h2>`

---

## 7. Imagens das Etapas

### Localização: `index.html` - Linhas 140-155

```html
<div class="step-images-section">
    <div class="step-image" id="step1-image">
        <img src="assets/step1.webp" alt="Step 1 Image" />
    </div>
    <div class="step-image" id="step2-image">
        <img src="assets/step2.webp" alt="Step 2 Image" />
    </div>
    <div class="step-image" id="step3-image">
        <img src="assets/step3.webp" alt="Step 3 Image" />
    </div>
    <div class="step-image" id="vsl-image">
        <img src="assets/vsl.webp" alt="VSL Image" />
    </div>
</div>
```

**Para alterar:** Substitua os arquivos na pasta `assets/` ou modifique os caminhos `src="assets/..."`

---

## Resumo dos Arquivos Principais

- **`index.html`**: Contém todos os embeds de vídeo, informações dos vídeos, link de checkout
- **`js/simple-quiz.js`**: Contém a lógica do VSL e configuração do delay
- **`assets/`**: Pasta com todas as imagens utilizadas

## IDs Importantes para Referência

- **Vídeo 1**: `68d86315096c154d172072d0`
- **Vídeo 2**: `68d8631e8b982964e6519e10`
- **Vídeo 3**: `68d86326a4bea31e50e76207`
- **VSL**: `68d8628f232c1a965f3c9395`