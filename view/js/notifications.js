// Sistema de notificações avançado para a aplicação
class NotificationSystem {
    constructor() {
        this.notifications = new Map();
        this.container = null;
        this.idCounter = 0;
        this.defaultOptions = {
            type: 'info',
            title: '',
            message: '',
            duration: 5000,
            position: 'top-right',
            closable: true,
            showIcon: true,
            autoHide: true,
            persistent: false,
            action: null,
            className: ''
        };
        
        this.init();
    }
    
    // Inicializa o sistema de notificações
    init() {
        this.createContainer();
        this.setupStyles();
        Logger.info('Sistema de notificações inicializado');
    }
    
    // Cria container para as notificações
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }
    
    // Configura estilos CSS do sistema
    setupStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
                pointer-events: none;
            }
            
            .notification {
                pointer-events: auto;
                margin-bottom: 10px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                position: relative;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification.hide {
                opacity: 0;
                transform: translateX(100%);
                margin-bottom: 0;
                padding: 0;
                max-height: 0;
            }
            
            .notification-success {
                background: linear-gradient(135deg, ${Config.get('colors.success')}dd, ${Config.get('colors.primary')}dd);
                color: white;
            }
            
            .notification-error {
                background: linear-gradient(135deg, ${Config.get('colors.danger')}dd, #c0392bdd);
                color: white;
            }
            
            .notification-warning {
                background: linear-gradient(135deg, ${Config.get('colors.warning')}dd, #f39c12dd);
                color: white;
            }
            
            .notification-info {
                background: linear-gradient(135deg, ${Config.get('colors.info')}dd, #3498dbdd);
                color: white;
            }
            
            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .notification-title {
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .notification-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .notification-message {
                font-size: 13px;
                line-height: 1.4;
                opacity: 0.95;
            }
            
            .notification-action {
                margin-top: 12px;
                text-align: right;
            }
            
            .notification-action button {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .notification-action button:hover {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.4);
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.5);
                transition: width linear;
            }
            
            @media (max-width: 768px) {
                .notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .notification {
                    transform: translateY(-100%);
                }
                
                .notification.show {
                    transform: translateY(0);
                }
                
                .notification.hide {
                    transform: translateY(-100%);
                }
            }
            
            /* Animação de pulso para notificações importantes */
            .notification-pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
                50% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25); }
                100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    show(options) {
        const config = { ...this.defaultOptions, ...options };
        const id = this.generateId();
        
        const notification = this.createNotification(id, config);
        this.notifications.set(id, { element: notification, config });
        
        // Adicionar ao container
        this.container.prepend(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide se configurado
        if (config.autoHide && !config.persistent) {
            this.scheduleHide(id, config.duration);
        }
        
        Logger.debug('Notificação exibida', { id, config });
        return id;
    }
    
    createNotification(id, config) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${config.type} ${config.className}`;
        notification.dataset.id = id;
        
        // Adicionar efeito de pulso se for crítico
        if (config.type === 'error' && config.persistent) {
            notification.classList.add('notification-pulse');
        }
        
        // Header
        const header = document.createElement('div');
        header.className = 'notification-header';
        
        const title = document.createElement('div');
        title.className = 'notification-title';
        
        if (config.showIcon) {
            const icon = this.getIcon(config.type);
            title.innerHTML = `<i class="${icon}"></i> ${config.title}`;
        } else {
            title.textContent = config.title;
        }
        
        header.appendChild(title);
        
        // Botão de fechar
        if (config.closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'notification-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.onclick = () => this.hide(id);
            header.appendChild(closeBtn);
        }
        
        notification.appendChild(header);
        
        // Mensagem
        if (config.message) {
            const message = document.createElement('div');
            message.className = 'notification-message';
            message.innerHTML = config.message;
            notification.appendChild(message);
        }
        
        // Ação
        if (config.action) {
            const actionDiv = document.createElement('div');
            actionDiv.className = 'notification-action';
            
            const actionBtn = document.createElement('button');
            actionBtn.textContent = config.action.text;
            actionBtn.onclick = () => {
                config.action.callback();
                if (config.action.closeAfter !== false) {
                    this.hide(id);
                }
            };
            
            actionDiv.appendChild(actionBtn);
            notification.appendChild(actionDiv);
        }
        
        // Barra de progresso para auto-hide
        if (config.autoHide && !config.persistent) {
            const progress = document.createElement('div');
            progress.className = 'notification-progress';
            progress.style.width = '100%';
            notification.appendChild(progress);
            
            // Animar barra de progresso
            setTimeout(() => {
                progress.style.width = '0%';
                progress.style.transitionDuration = `${config.duration}ms`;
            }, 100);
        }
        
        return notification;
    }
    
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        return icons[type] || icons.info;
    }
    
    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        const element = notification.element;
        element.classList.add('hide');
        
        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
            this.notifications.delete(id);
        }, 300);
        
        Logger.debug('Notificação ocultada', { id });
    }
    
    scheduleHide(id, duration) {
        setTimeout(() => {
            this.hide(id);
        }, duration);
    }
    
    hideAll() {
        for (const [id] of this.notifications) {
            this.hide(id);
        }
    }
    
    generateId() {
        return `notification-${++this.idCounter}-${Date.now()}`;
    }
    
    // Métodos de conveniência
    success(title, message, options = {}) {
        return this.show({
            type: 'success',
            title: title,
            message: message,
            ...options
        });
    }
    
    error(title, message, options = {}) {
        return this.show({
            type: 'error',
            title: title,
            message: message,
            persistent: true,
            ...options
        });
    }
    
    warning(title, message, options = {}) {
        return this.show({
            type: 'warning',
            title: title,
            message: message,
            ...options
        });
    }
    
    info(title, message, options = {}) {
        return this.show({
            type: 'info',
            title: title,
            message: message,
            ...options
        });
    }
    
    // Notificação com ação
    confirm(title, message, onConfirm, onCancel = null) {
        return this.show({
            type: 'warning',
            title: title,
            message: message,
            persistent: true,
            autoHide: false,
            action: {
                text: 'Confirmar',
                callback: onConfirm,
                closeAfter: true
            }
        });
    }
}

// Instância global do sistema de notificações
var notifications = new NotificationSystem();

// Funções de conveniência para uso global
function showNotification(type, title, message, options = {}) {
    return notifications[type](title, message, options);
}

function showSuccess(title, message, options = {}) {
    return notifications.success(title, message, options);
}

function showError(title, message, options = {}) {
    return notifications.error(title, message, options);
}

function showWarning(title, message, options = {}) {
    return notifications.warning(title, message, options);
}

function showInfo(title, message, options = {}) {
    return notifications.info(title, message, options);
}

function showConfirm(title, message, onConfirm, onCancel = null) {
    return notifications.confirm(title, message, onConfirm, onCancel);
}

// Integração com sistema de alertas existente
function replaceExistingAlerts() {
    // Converte alertas Bootstrap para notificações
    const existingAlerts = document.querySelectorAll('.alert');
    
    existingAlerts.forEach(alert => {
        const type = alert.classList.contains('alert-success') ? 'success' :
                    alert.classList.contains('alert-danger') ? 'error' :
                    alert.classList.contains('alert-warning') ? 'warning' : 'info';
        
        const title = alert.querySelector('strong')?.textContent || 'Aviso';
        const message = alert.textContent.replace(title, '').trim();
        
        if (message) {
            notifications[type](title, message);
            alert.style.display = 'none';
        }
    });
}

// Inicialização do sistema quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda outros scripts carregarem antes de inicializar
    setTimeout(() => {
        replaceExistingAlerts();
    }, 500);
});

// Exporta funcionalidades para uso global
if (typeof window !== 'undefined') {
    window.NotificationSystem = NotificationSystem;
    window.notifications = notifications;
    window.showNotification = showNotification;
    window.showSuccess = showSuccess;
    window.showError = showError;
    window.showWarning = showWarning;
    window.showInfo = showInfo;
    window.showConfirm = showConfirm;
}
