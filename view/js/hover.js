// Adiciona efeitos de hover nos cards de mobs
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.masonry-item .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.borderColor = '#3E8E41';
            this.style.boxShadow = '0 12px 30px rgba(62, 142, 65, 0.3)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = '#8B8B8B';
            this.style.boxShadow = '';
        });
    });
}

// Adiciona efeitos de hover em botões de exclusão
function addDeleteButtonHoverEffects() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#6B4A32';
            this.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#835C3B';
            this.style.transform = 'scale(1)';
        });
    });
}

// Adiciona efeitos de hover nos links de navegação
function addNavigationHoverEffects() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const originalColor = link.style.color || 'white';
        
        link.addEventListener('mouseenter', function() {
            this.style.color = '#F0E68C';
            this.style.transition = 'color 0.3s ease';
        });

        link.addEventListener('mouseleave', function() {
            this.style.color = originalColor;
        });
    });
}

// ===== EFEITOS DE HOVER PARA BOTÕES PRIMÁRIOS =====

// Função para adicionar efeitos de hover em botões primários
function addPrimaryButtonHoverEffects() {
    const primaryButtons = document.querySelectorAll('.btn-primary, [style*="background-color: #33C5F3"]');
    primaryButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#2AB5E3';
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });

        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#33C5F3';
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== INICIALIZAÇÃO DOS EFEITOS =====

// Função para inicializar todos os efeitos de hover
function initializeHoverEffects() {
    addCardHoverEffects();
    addDeleteButtonHoverEffects();
    addNavigationHoverEffects();
    addPrimaryButtonHoverEffects();
}

// ===== UTILITÁRIOS DE HOVER =====

// Função para adicionar ripple effect
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    });
}

// CSS para animação ripple (inserido via JavaScript)
if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}