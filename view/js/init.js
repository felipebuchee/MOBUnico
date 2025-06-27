// Função principal de inicialização da aplicação
function initializeApp() {
    console.log('🎮 Inicializando MOBÚnico...');
    
    // Inicializa animações visuais
    initializeAnimations();
    
    // Inicializa efeitos de hover se disponível
    if (typeof initializeHoverEffects === 'function') {
        initializeHoverEffects();
    }
    
    // Configura alertas que se ocultam automaticamente
    if (typeof setupAutoHideAlerts === 'function') {
        setupAutoHideAlerts();
    }
    
    // Configura rolagem suave
    setupSmoothScroll();
    
    // Configura carregamento tardio se disponível
    setupLazyLoading();
    
    // Configura efeitos ripple nos botões
    setupRippleEffects();
    
    console.log('✅ MOBÚnico inicializado com sucesso!');
}

// Inicializa animações após pequeno delay
function initializeAnimations() {
    setTimeout(() => {
        if (typeof animateCards === 'function') {
            animateCards();
        }
        if (typeof addCardHoverEffects === 'function') {
            addCardHoverEffects();
        }
    }, 100);
}

// Configura rolagem suave para links internos
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para configurar lazy loading de imagens
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Função para configurar ripple effects
function setupRippleEffects() {
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
        if (typeof addRippleEffect === 'function') {
            addRippleEffect(button);
        }
    });
}

// ===== UTILITÁRIOS DE INICIALIZAÇÃO =====

// Função para debug da inicialização
function debugInitialization() {
    console.log('🔍 Debug da Inicialização:', {
        cardsEncontrados: document.querySelectorAll('.masonry-item').length,
        modalExiste: !!document.getElementById('modalExclusao'),
        bootstrapCarregado: typeof bootstrap !== 'undefined',
        funcoesDisponiveis: {
            animateCards: typeof animateCards === 'function',
            addCardHoverEffects: typeof addCardHoverEffects === 'function',
            confirmarExclusao: typeof confirmarExclusao === 'function'
        }
    });
}

// Função para verificar dependências
function checkDependencies() {
    const dependencies = {
        bootstrap: typeof bootstrap !== 'undefined',
        fontAwesome: !!document.querySelector('link[href*="font-awesome"]') || !!document.querySelector('link[href*="fontawesome"]')
    };
    
    Object.entries(dependencies).forEach(([name, loaded]) => {
        if (!loaded) {
            console.warn(`⚠️ Dependência não carregada: ${name}`);
        }
    });
    
    return dependencies;
}

// ===== EVENT LISTENERS =====

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar dependências
    checkDependencies();
    
    // Debug se necessário
    if (window.location.search.includes('debug=true')) {
        debugInitialization();
    }
    
    // Inicializar aplicação
    initializeApp();
});

// Listener para redimensionamento da janela
window.addEventListener('resize', function() {
    // Recalcular layout masonry se necessário
    setTimeout(() => {
        if (typeof animateCards === 'function') {
            animateCards();
        }
    }, 300);
});

// Listener para mudanças de visibilidade da página
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Página ficou visível, verificar se precisa recarregar animações
        setTimeout(() => {
            if (typeof addCardHoverEffects === 'function') {
                addCardHoverEffects();
            }
        }, 100);
    }
});

// ===== EXPORTS (caso seja usado como módulo) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        setupSmoothScroll,
        setupLazyLoading,
        debugInitialization
    };
}