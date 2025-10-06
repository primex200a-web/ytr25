document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    let balance = 9.27;
    let hasEvaluated = false;
    let loadedScripts = new Set(); // Track loaded scripts to avoid duplicates

    const stepData = {
        1: { increment: 36.82, newBalance: 46.09 },
        2: { increment: 34.20, newBalance: 80.29 },
        3: { increment: 133.62, newBalance: 213.91 },
        4: { increment: 0, newBalance: 213.91 }
    };

    const balanceElement = document.getElementById('balance-amount');
    const popupOverlay = document.getElementById('popup-overlay');
    const evalButtons = document.querySelectorAll('.eval-btn');
    const instructionText = document.getElementById('instruction-text');
    const popupBalance = document.getElementById('popup-balance');
    const balanceIncrement = document.getElementById('balance-increment');

    // Criar elemento de áudio para o som de dinheiro
    const moneyAudio = new Audio('assets/money.mpeg');
    moneyAudio.volume = 0.5; // Volume moderado
    moneyAudio.preload = 'auto';

    // Função para reproduzir o áudio com tratamento de erros
    function playMoneySound() {
        try {
            // Reset audio to beginning in case it was played before
            moneyAudio.currentTime = 0;
            
            // Play the audio
            const playPromise = moneyAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Erro ao reproduzir áudio:', error);
                    // Silently handle autoplay restrictions
                });
            }
        } catch (error) {
            console.log('Erro ao reproduzir áudio:', error);
        }
    }

    // Função para animar o valor final no modal de congratulações
    function animateRewardAmount() {
        const rewardElement = document.querySelector('.reward-amount');
        if (!rewardElement) return;
        
        const finalValue = 213.91;
        const duration = 2500; // 2.5 segundos
        const startTime = performance.now();
        
        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            
            const currentValue = easedProgress * finalValue;
            rewardElement.textContent = `$${currentValue.toFixed(2)}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Garantir que o valor final seja exato
                rewardElement.textContent = `$${finalValue.toFixed(2)}`;
            }
        }
        
        // Iniciar com $0.00
        rewardElement.textContent = '$0.00';
        requestAnimationFrame(updateCounter);
    }

    // Função para animar contador de valores monetários
    function animateCounter(element, startValue, endValue, duration = 1500) {
        if (!element) return;
        
        const startTime = performance.now();
        const difference = endValue - startValue;
        
        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            
            const currentValue = startValue + (difference * easedProgress);
            element.textContent = `$${currentValue.toFixed(2)}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    function loadVideoScript(type) {
    
    let scriptSrc = '';
    
    if (type === 'vsl') {
            scriptSrc = 'https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/68d8628f232c1a965f3c9395/v4/player.js';
            
            // Verificar se o script já foi carregado
            const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
            if (existingScript) {
                // Script já carregado, apenas inicializar o player
                setTimeout(() => {
                    const player = document.querySelector('vturb-smartplayer');
                    if (player) {
                        player.addEventListener('player:ready', () => {
                            const delaySeconds = 530;
                            player.displayHiddenElements(delaySeconds, [".esconder"], {persist: true});
                        });
                    }
                }, 500);
                return;
            }
            
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.type = 'text/javascript';
            script.async = true;
            
            script.onload = () => {
                // Aguardar um pouco para o player ser inicializado
                setTimeout(() => {
                    const player = document.querySelector('vturb-smartplayer');
                    if (player) {
                        player.addEventListener('player:ready', () => {
                            const delaySeconds = 530;
                            player.displayHiddenElements(delaySeconds, [".esconder"], {persist: true});
                        });
                    }
                }, 500);
            };
            
            document.head.appendChild(script);
        }
    }



    function showVideo(stepNumber) {
        const videoDivs = ['video1', 'video2', 'video3', 'vsl'];
        
        // Stop/pause all videos before hiding them
        videoDivs.forEach(divId => {
            const div = document.getElementById(divId);
            if (div) {
                // Stop iframe videos (steps 1-3)
                if (divId !== 'vsl') {
                    const iframe = div.querySelector('iframe');
                    if (iframe) {
                        // Reload iframe to stop video
                        const src = iframe.src;
                        iframe.src = 'about:blank';
                        setTimeout(() => {
                            iframe.src = src;
                        }, 100);
                    }
                } else {
                    // Stop VSL player
                    const vslPlayer = div.querySelector('vturb-smartplayer');
                    if (vslPlayer && typeof vslPlayer.pause === 'function') {
                        try {
                            vslPlayer.pause();
                        } catch (e) {
                            console.log('Erro ao pausar VSL player:', e);
                        }
                    }
                }
                div.style.display = 'none';
            }
        });

        const currentDivId = stepNumber <= 3 ? `video${stepNumber}` : 'vsl';
        const currentDiv = document.getElementById(currentDivId);
        if (currentDiv) {
            // Load script only for VSL (step 4) - videos 1-3 are iframes
            if (stepNumber === 4) {
                loadVideoScript('vsl');
            }
            currentDiv.style.display = 'block';
        }
        
        // Control evaluation and payment sections visibility based on step
        updateSectionVisibility(stepNumber);
    }

    function updateSectionVisibility(stepNumber) {
        const evaluationSection = document.getElementById('evaluation-section');
        const paymentSection = document.getElementById('payment-section');
        const vslTitle = document.getElementById('vsl-title');
        
        // Get all step images
        const stepImages = {
            1: document.getElementById('step1-image'),
            2: document.getElementById('step2-image'),
            3: document.getElementById('step3-image'),
            4: document.getElementById('vsl-image')
        };
        
        // Get all video info elements
        const videoInfos = {
            1: document.getElementById('step1-video-info'),
            2: document.getElementById('step2-video-info'),
            3: document.getElementById('step3-video-info')
        };
        
        if (stepNumber === 4) {
            // Step 4 (VSL): Hide evaluation, show VSL title
            // Payment section visibility is controlled by .esconder class and vturb delay
            if (evaluationSection) evaluationSection.style.display = 'none';
            if (vslTitle) vslTitle.style.display = 'block';
            

        } else {
            // Steps 1-3: Show evaluation, hide payment and VSL title
            if (evaluationSection) evaluationSection.style.display = 'block';
            if (paymentSection) paymentSection.style.display = 'none';
            if (vslTitle) vslTitle.style.display = 'none';
        }
        
        // Hide all step images first
        Object.values(stepImages).forEach(img => {
            if (img) img.style.display = 'none';
        });
        
        // Show the current step's image
        if (stepImages[stepNumber]) {
            stepImages[stepNumber].style.display = 'block';
        }
        
        // Hide all video info elements first
        Object.values(videoInfos).forEach(info => {
            if (info) info.style.display = 'none';
        });
        
        // Show the current step's video info (only for steps 1-3)
        if (stepNumber >= 1 && stepNumber <= 3 && videoInfos[stepNumber]) {
            videoInfos[stepNumber].style.display = 'block';
        }
    }

    function updateBalance() {
        const data = stepData[currentStep];
        if (!data) return;

        const previousBalance = balance;
        balance = data.newBalance;
        
        // Animar o saldo do header do valor anterior para o novo valor
        if (balanceElement) {
            animateCounter(balanceElement, previousBalance, balance, 1500);
        }
        
        // O popup balance será animado na função showThankYouPopup
        if (balanceIncrement && data.increment > 0) {
            balanceIncrement.textContent = `+$${data.increment.toFixed(2)}`;
        }
    }

    function showThankYouPopup() {
        if (popupOverlay) {
            // Reproduzir som de dinheiro ao abrir o popup
            playMoneySound();
            
            popupOverlay.style.display = 'flex';
            popupOverlay.classList.add('show');
            
            // Animar o saldo do popup de 0 para o valor atual
            if (popupBalance) {
                animateCounter(popupBalance, 0, balance, 1500);
            }
            
            // Controlar estado dos botões baseado na etapa atual
            updateModalButtons();
        }
    }

    function hideThankYouPopup() {
        if (popupOverlay) {
            popupOverlay.classList.remove('show');
            setTimeout(() => {
                popupOverlay.style.display = 'none';
            }, 300);
        }
    }

    function showCongratulationsModal() {
        const congratulationsOverlay = document.getElementById('congratulations-overlay');
        if (congratulationsOverlay) {
            congratulationsOverlay.style.display = 'flex';
            congratulationsOverlay.classList.add('show');
            
            // Iniciar animação do counter após um pequeno delay para o modal aparecer
            setTimeout(() => {
                animateRewardAmount();
            }, 300);
        }
    }

    function hideCongratulationsModal() {
        const congratulationsOverlay = document.getElementById('congratulations-overlay');
        if (congratulationsOverlay) {
            congratulationsOverlay.classList.remove('show');
            setTimeout(() => {
                congratulationsOverlay.style.display = 'none';
            }, 300);
        }
    }

    function goToVSL() {
        hideCongratulationsModal();
        hideThankYouPopup();
        
        currentStep = 4; // VSL é a etapa 4
        hasEvaluated = false;
        
        showVideo(currentStep);
        enableEvalButtons();
    }

    function advanceStep() {
        hideThankYouPopup();
        
        currentStep++;
        hasEvaluated = false;
        
        if (currentStep <= 4) {
            showVideo(currentStep);
            enableEvalButtons();
        } else {
            instructionText.textContent = 'Parabéns! Você completou todos os vídeos!';
        }
    }

    function handleEvaluation() {
        if (hasEvaluated) return;
        
        hasEvaluated = true;
        
        // Reproduzir som de dinheiro ao clicar no botão de avaliação
        playMoneySound();
        
        // Remove glow effect when user clicks
        removeGlowEffect();
        
        evalButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
        
        updateBalance();
        showThankYouPopup();
    }

    function enableEvalButtons() {
        evalButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        
        if (instructionText) {
            instructionText.textContent = 'Answer the question:';
        }
        
        // Add glow effect only on first step
        if (currentStep === 1) {
            addGlowEffect();
        }
    }

    function addGlowEffect() {
        evalButtons.forEach(btn => {
            btn.classList.add('glow-hint');
        });
    }

    function removeGlowEffect() {
        evalButtons.forEach(btn => {
            btn.classList.remove('glow-hint');
        });
    }

    function updateModalButtons() {
        const withdrawBtn = document.getElementById('withdraw-btn');
        const continueBtn = document.getElementById('continue-btn');
        const withdrawIcon = document.querySelector('.withdraw-icon');
        const continueIcon = document.querySelector('.continue-icon');
        
        if (withdrawBtn && continueBtn && withdrawIcon) {
            // Lógica de controle por etapa
            if (currentStep === 1 || currentStep === 2) {
                // Etapas 1 e 2: Withdraw disabled, Watch more videos enabled
                withdrawBtn.disabled = true;
                withdrawBtn.style.opacity = '0.5';
                withdrawBtn.style.cursor = 'not-allowed';
                withdrawBtn.style.background = '#f8f9fa';
                withdrawBtn.style.color = '#9aa0a6';
                
                // Ícone de cadeado quando bloqueado
                withdrawIcon.setAttribute('data-lucide', 'lock');
                
                continueBtn.disabled = false;
                continueBtn.style.opacity = '1';
                continueBtn.style.cursor = 'pointer';
                continueBtn.style.background = '#1976d2';
                continueBtn.style.color = '#ffffff';
                
                // Ícone de seta para continuar
                if (continueIcon) {
                    continueIcon.setAttribute('data-lucide', 'arrow-right');
                }
            } else if (currentStep === 3) {
                // Etapa 3: Withdraw azul com ícone $, Watch more videos cinza com cadeado
                withdrawBtn.disabled = false;
                withdrawBtn.style.opacity = '1';
                withdrawBtn.style.cursor = 'pointer';
                withdrawBtn.style.background = '#1976d2';
                withdrawBtn.style.color = '#ffffff';
                
                // Ícone de dollar sign quando ativo na etapa 3
                withdrawIcon.setAttribute('data-lucide', 'dollar-sign');
                
                continueBtn.disabled = true;
                continueBtn.style.opacity = '0.5';
                continueBtn.style.cursor = 'not-allowed';
                continueBtn.style.background = '#f8f9fa';
                continueBtn.style.color = '#9aa0a6';
                
                // Ícone de cadeado para watch more videos na etapa 3
                if (continueIcon) {
                    continueIcon.setAttribute('data-lucide', 'lock');
                }
            }
            
            // Recriar os ícones do Lucide após mudança
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    evalButtons.forEach(btn => {
        btn.addEventListener('click', handleEvaluation);
    });

    // Event listeners para os botões do modal
    document.addEventListener('click', (e) => {
        if (e.target.id === 'continue-btn' || e.target.closest('#continue-btn')) {
            if (!document.getElementById('continue-btn').disabled) {
                advanceStep();
            }
        }
        
        if (e.target.id === 'withdraw-btn' || e.target.closest('#withdraw-btn')) {
            if (!document.getElementById('withdraw-btn').disabled) {
                // Na etapa 3, abrir modal de congratulações
                if (currentStep === 3) {
                    showCongratulationsModal();
                } else {
                    // Para outras etapas, manter comportamento padrão
                    alert('Withdraw functionality - to be implemented');
                    hideThankYouPopup();
                }
            }
        }
        
        // Event listener para o botão Continue do modal de congratulações
        if (e.target.id === 'congratulations-continue-btn' || e.target.closest('#congratulations-continue-btn')) {
            goToVSL();
        }
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    showVideo(currentStep);
    enableEvalButtons();
    
    // Animar o saldo inicial de $0.00 para $9.27 quando a página carregar
    if (balanceElement) {
        animateCounter(balanceElement, 0, 9.27, 1500);
    }


    

});