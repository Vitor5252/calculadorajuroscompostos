document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('loaded');

    // Função para rolar suavemente para o topo
    function smoothScrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Detecta quando a página está sendo recarregada
    window.addEventListener('beforeunload', function() {
        smoothScrollToTop();
    });

    // Verifica se a página foi recarregada
    if (performance.navigation.type === 1) {
        setTimeout(() => {
            smoothScrollToTop();
        }, 0);
    }

    // Garantir que o link da logo não abra em uma nova aba
    const logoLink = document.getElementById('logo-link');
    logoLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = this.href;
    });
});

// Menu Hamburguer
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.querySelectorAll('.menu a');

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.checked = false;
        });
    });
});
