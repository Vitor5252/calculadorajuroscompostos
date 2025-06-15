document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('loaded');
    console.log('DOMContentLoaded: body class added');

    // Função para rolar suavemente para o topo
    function smoothScrollToTop() {
        console.log('smoothScrollToTop called');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Detecta quando a página está sendo recarregada
    window.addEventListener('beforeunload', function() {
        console.log('beforeunload: calling smoothScrollToTop');
        smoothScrollToTop();
    });

    // Verifica se a página foi recarregada
    if (performance.navigation.type === 1 || performance.navigation.type === 2) {
        console.log('Page reloaded: calling smoothScrollToTop');
        setTimeout(() => {
            if (window.scrollY !== 0) {
                smoothScrollToTop();
            }
        }, 0);
    }
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

    // Garantir que o link da logo não abra em uma nova aba
    const logoLink = document.querySelector('.logo').parentElement;
    logoLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = this.href;
    });
});
