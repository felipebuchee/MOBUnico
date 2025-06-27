// Exibe visualização em formato de cards
function mostrarCards() {
    document.getElementById('visualizacaoCards').style.display = 'block';
    document.getElementById('visualizacaoTabela').style.display = 'none';

    const btnCards = document.getElementById('btnCards');
    const btnTabela = document.getElementById('btnTabela');
    
    if (btnCards && btnTabela) {
        btnCards.style.backgroundColor = '#33C5F3';
        btnCards.style.borderColor = '#33C5F3';
        btnTabela.style.backgroundColor = '#8B8B8B';
        btnTabela.style.borderColor = '#8B8B8B';
    }
    
    // Reaplica animações nos cards
    animateCards();
}

// Exibe visualização em formato de tabela
function mostrarTabela() {
    document.getElementById('visualizacaoCards').style.display = 'none';
    document.getElementById('visualizacaoTabela').style.display = 'block';

    const btnCards = document.getElementById('btnCards');
    const btnTabela = document.getElementById('btnTabela');
    
    if (btnCards && btnTabela) {
        btnTabela.style.backgroundColor = '#33C5F3';
        btnTabela.style.borderColor = '#33C5F3';
        btnCards.style.backgroundColor = '#8B8B8B';
        btnCards.style.borderColor = '#8B8B8B';
    }
}

// Anima a entrada dos cards de mobs
function animateCards() {
    const cards = document.querySelectorAll('.masonry-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ===== FUNCIONALIDADES DE EXCLUSÃO =====

// Função para confirmar exclusão de mob
function confirmarExclusao(idMob, nomeMob) {
    if (!idMob || !nomeMob) {
        console.error('ID ou nome do mob não fornecidos');
        return;
    }
    
    const nomeMobElement = document.getElementById('nomeMobExclusao');
    const linkExclusaoElement = document.getElementById('linkExclusao');
    const modalElement = document.getElementById('modalExclusao');
    
    if (nomeMobElement && linkExclusaoElement && modalElement) {
        nomeMobElement.textContent = nomeMob;
        linkExclusaoElement.href = `visualizar.php?excluir=${idMob}`;
        
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.error('Elementos do modal não encontrados');
        // Fallback: confirmação simples
        if (confirm(`Tem certeza que deseja excluir o mob "${nomeMob}"?\n\nEsta ação não pode ser desfeita!`)) {
            window.location.href = `visualizar.php?excluir=${idMob}`;
        }
    }
}

// ===== UTILITÁRIOS =====

// Função para auto-hide de alertas
function setupAutoHideAlerts() {
    const alertas = document.querySelectorAll('.alert');
    alertas.forEach(alerta => {
        if (alerta.textContent.includes('sucesso')) {
            setTimeout(() => {
                alerta.style.transition = 'opacity 0.5s ease';
                alerta.style.opacity = '0';
                setTimeout(() => {
                    if (alerta.parentNode) {
                        alerta.remove();
                    }
                }, 500);
            }, 5000);
        }
    });
}

// Função para debug
function debugMobInfo(idMob, nomeMob) {
    console.log('Debug Mob Info:', {
        id: idMob,
        nome: nomeMob,
        tipo: typeof idMob,
        nomeVazio: !nomeMob,
        idVazio: !idMob
    });
}