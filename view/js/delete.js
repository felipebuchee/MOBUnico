// Função principal para confirmar exclusão de mobs
function confirmarExclusao(idMob, nomeMob) {
    console.log('🗑️ Iniciando processo de exclusão:', { id: idMob, nome: nomeMob });
    
    // Validações de dados obrigatórios
    if (!idMob || !nomeMob) {
        console.error('❌ Erro: ID ou nome do mob não fornecidos');
        showErrorAlert('Erro interno: Dados do mob não encontrados.');
        return;
    }

    // Verifica se elementos do modal existem no DOM
    const nomeMobElement = document.getElementById('nomeMobExclusao');
    const linkExclusaoElement = document.getElementById('linkExclusao');
    const modalElement = document.getElementById('modalExclusao');

    if (nomeMobElement && linkExclusaoElement && modalElement) {
        // Usa modal do Bootstrap se disponível
        console.log('✅ Modal encontrado, configurando...');
        setupModal(idMob, nomeMob, nomeMobElement, linkExclusaoElement, modalElement);
    } else {
        // Usa confirmação simples como fallback
        console.warn('⚠️ Modal não encontrado, usando confirmação simples');
        useSimpleConfirmation(idMob, nomeMob);
    }
}

// Configura e exibe o modal de exclusão
function setupModal(idMob, nomeMob, nomeMobElement, linkExclusaoElement, modalElement) {
    try {
        // Define conteúdo do modal
        nomeMobElement.textContent = nomeMob;
        linkExclusaoElement.href = `visualizar.php?excluir=${idMob}`;
        
        // Inicializa modal Bootstrap se disponível
        if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            console.log('✅ Modal exibido com sucesso');
        } else {
            console.error('❌ Bootstrap não encontrado');
            useSimpleConfirmation(idMob, nomeMob);
        }
    } catch (error) {
        console.error('❌ Erro ao configurar modal:', error);
        useSimpleConfirmation(idMob, nomeMob);
    }
}

// Usa confirmação JavaScript simples como fallback
function useSimpleConfirmation(idMob, nomeMob) {
    const confirmMessage = `⚠️ ATENÇÃO!\n\nTem certeza que deseja excluir o mob "${nomeMob}"?\n\n❗ Esta ação não pode ser desfeita!`;
    
    if (confirm(confirmMessage)) {
        console.log('✅ Usuário confirmou exclusão via confirmação simples');
        window.location.href = `visualizar.php?excluir=${idMob}`;
    } else {
        console.log('❌ Usuário cancelou exclusão');
    }
}

// Exibe alerta de erro para o usuário
function showErrorAlert(message) {
    if (typeof showError === 'function') {
        showError('Erro', message);
    } else {
        // Cria alerta HTML como fallback
        const alertContainer = document.querySelector('.container-fluid');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger alert-dismissible fade show';
            alert.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Erro:</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            alertContainer.insertBefore(alert, alertContainer.firstChild);
            
            // Remove alerta automaticamente após 5 segundos
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }
}

// Exibe alerta de sucesso para o usuário
function showSuccessAlert(message) {
    if (typeof showSuccess === 'function') {
        showSuccess('Successo', message);
    } else {
        // Cria alerta HTML como fallback
        const alertContainer = document.querySelector('.container-fluid');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-success alert-dismissible fade show';
            alert.style.backgroundColor = '#3E8E41';
            alert.style.borderColor = '#5E7C16';
            alert.style.color = 'white';
            alert.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                <strong>Sucesso:</strong> ${message}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            `;
            alertContainer.insertBefore(alert, alertContainer.firstChild);
            
            // Remove alerta automaticamente após 5 segundos
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }
}

// Função para debug das informações de exclusão
function debugExclusao(idMob, nomeMob) {
    console.group('🔍 Debug Exclusão de Mob');
    console.log('ID do Mob:', idMob, typeof idMob);
    console.log('Nome do Mob:', nomeMob, typeof nomeMob);
    console.log('Modal Existe:', !!document.getElementById('modalExclusao'));
    console.log('Bootstrap Disponível:', typeof bootstrap !== 'undefined');
    console.log('URL de Exclusão:', `visualizar.php?excluir=${idMob}`);
    console.groupEnd();
}

// Verifica se exclusão foi bem-sucedida via URL
function checkDeleteSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const excluido = urlParams.get('excluido');
    
    if (excluido === 'sucesso') {
        showSuccessAlert('Mob excluído com sucesso!');
        // Remove parâmetros da URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Configura event listeners para funcionalidades de exclusão
function setupDeleteListeners() {
    // Listener para botões de exclusão com onclick
    document.addEventListener('click', function(e) {
        if (e.target.closest('[onclick*="confirmarExclusao"]')) {
            e.preventDefault();
            // O onclick já chama a função
            return;
        }
        
        // Listener para botões com data attributes
        const deleteBtn = e.target.closest('[data-delete-id]');
        if (deleteBtn) {
            e.preventDefault();
            const idMob = deleteBtn.dataset.deleteId;
            const nomeMob = deleteBtn.dataset.deleteName;
            confirmarExclusao(idMob, nomeMob);
        }
    });
    
    // Listener para tecla ESC fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalExclusao');
            if (modal && modal.classList.contains('show')) {
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            }
        }
    });
}

// Inicializa funcionalidades quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setupDeleteListeners();
    checkDeleteSuccess();
    
    // Log de debug se necessário
    if (window.location.search.includes('debug=true')) {
        console.log('🔧 Funcionalidades de exclusão inicializadas');
    }
});

// Exporta funções para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        confirmarExclusao,
        showErrorAlert,
        showSuccessAlert,
        debugExclusao
    };
}
