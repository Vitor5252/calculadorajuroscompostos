document.addEventListener("DOMContentLoaded", function () {
    // Função para adicionar os placeholders formatados
    function addPlaceholders() {
        document.getElementById('initialCapital').value = "";
        document.getElementById('capitalByMonth').value = "";
        document.getElementById('time').value = "";
        document.getElementById('profitabilityPercent').value = "";
        document.getElementById('initialCapital').placeholder = "0,00";
        document.getElementById('capitalByMonth').placeholder = "0,00";
        document.getElementById('time').placeholder = "0";
        document.getElementById('profitabilityPercent').placeholder = "0,00";
    }

    addPlaceholders();

    // Remove placeholder ao focar
    function removePlaceholder(e) {
        e.target.placeholder = "";
    }

    // Restaura placeholder se campo estiver vazio
    function restorePlaceholder(e) {
        if (e.target.value === "") {
            if (["initialCapital", "capitalByMonth", "profitabilityPercent"].includes(e.target.id)) {
                e.target.placeholder = "0,00";
            } else if (e.target.id === "time") {
                e.target.placeholder = "0";
            }
        }
    }

    // Adiciona eventos de foco e blur nos inputs
    ["initialCapital", "capitalByMonth", "time", "profitabilityPercent"].forEach(id => {
        document.getElementById(id).addEventListener('focus', removePlaceholder);
        document.getElementById(id).addEventListener('blur', restorePlaceholder);
    });

    // Converte moeda formatada para número
    function parseCurrency(value) {
        return parseFloat(value.replace(/[R$\s\.]/g, '').replace(',', '.'));
    }

    // Seleciona os botões
    const calculateButton = document.querySelector("#calculate");
    const cleanButton = document.querySelector("#clean");
    const undoButton = document.querySelector("#undo");

    const formatter = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Evento ao clicar em "Calcular"
    calculateButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Captura e converte os valores
        const capitalInicial = parseCurrency(document.querySelector("#initialCapital").value) || 0;
        const investimentoMensal = parseCurrency(document.querySelector("#capitalByMonth").value) || 0;
        const tempo = parseInt(document.querySelector("#time").value) || 0;
        let rentabilidade = parseFloat(document.querySelector("#profitabilityPercent").value.replace(/,/g, '.')) || 0;
        const porAno = document.querySelector("#profitabilityYear").checked;
        let tempoEmMeses = tempo;

        // Converte tempo em anos para meses se necessário
        if (document.querySelector("#timePeriodYears").checked) {
            tempoEmMeses = tempo * 12;
        }

        // Converte rentabilidade anual para mensal
        if (porAno) {
            rentabilidade /= 12;
        }

        rentabilidade /= 100; // Converte de % para decimal

        let valorFinal = capitalInicial;
        let juros_compostos_total = 0;

        // Calcula juros compostos mês a mês
        for (let i = 1; i <= tempoEmMeses; i++) {
            const juros = valorFinal * rentabilidade;
            juros_compostos_total += juros;
            valorFinal += investimentoMensal + juros;
        }

        const investimentoTotal = capitalInicial + (investimentoMensal * tempoEmMeses);
        const rendaMensalLiquida = valorFinal * rentabilidade * (1 - 0.225); // Imposto de 22,5%

        // Atualiza os resultados no DOM
        document.querySelector('.rs-total-investido').innerHTML = "R$ " + formatter.format(investimentoTotal);
        document.querySelector('.rs-juros').innerHTML = "R$ " + formatter.format(juros_compostos_total);
        document.querySelector('.rs-acumulado').innerHTML = "R$ " + formatter.format(valorFinal);
        document.querySelector('.rs-rent-income').innerHTML = "R$ " + formatter.format(rendaMensalLiquida);

        const resultSection = document.getElementById("result");
        resultSection.style.display = "block";

        // Força o navegador a reconhecer a mudança
        resultSection.offsetHeight;

        // Scroll suave até a seção de resultados
        setTimeout(() => {
            const headerOffset = 100;
            const elementPosition = resultSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 250);
    });

    // Botão "Voltar"
    undoButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector('#result').style.display = "none";
        document.querySelector('#evaluate').style.display = "block";

        // Animação suave para voltar ao formulário
        $('html, body').animate({
            scrollTop: $("#evaluate").offset().top - window.innerHeight + $("#evaluate").outerHeight() / 2
        }, 50);
    });

    // Botão "Limpar"
    cleanButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#initialCapital").value = "";
        document.querySelector("#capitalByMonth").value = "";
        document.querySelector("#time").value = "";
        document.querySelector("#profitabilityPercent").value = "";
        addPlaceholders();
    });

    // Marca o carregamento final da página
    document.body.classList.add('loaded');

    // Cookie banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    if (cookiesAccepted === 'true') {
        cookieBanner.style.display = 'none';
    } else if (cookiesAccepted !== 'false') {
        cookieBanner.style.display = 'block';
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
    });

    rejectCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieBanner.style.display = 'none';
    });

    // Efeito no header ao rolar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const inputMoneyFields = document.querySelectorAll('.input-money');
    const inputPercentFields = document.querySelectorAll('.input-percent');

    // Função para formatar valores monetários
    function formatCurrency(value) {
        let cleanValue = parseInt(value.replace(/\D/g, ''), 10);
        if (isNaN(cleanValue)) {
            cleanValue = 0;
        }
        cleanValue /= 100;
        return "R$ " + cleanValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }

    // Função para formatar valores percentuais
    function formatPercent(value) {
        let cleanValue = parseInt(value.replace(/\D/g, ''), 10);
        if (isNaN(cleanValue)) {
            cleanValue = 0;
        }
        cleanValue /= 100;
        return cleanValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + " %";
    }

    inputMoneyFields.forEach(input => {
        input.value = formatCurrency(input.value);
        input.addEventListener('input', function() {
            let numbersOnly = input.value.replace(/\D/g, '');
            let paddedNumber = numbersOnly.padStart(3, '0');
            input.value = formatCurrency(paddedNumber);
        });
    });

    inputPercentFields.forEach(input => {
        input.value = formatPercent(input.value);
        input.addEventListener('input', function() {
            let numbersOnly = input.value.replace(/\D/g, '');
            let paddedNumber = numbersOnly.padStart(3, '0');
            input.value = formatPercent(paddedNumber);
        });
    });

    // Função para resetar e formatar campos ao clicar em Limpar
    document.querySelector('#clean').addEventListener('click', function() {
        inputMoneyFields.forEach(input => {
            input.value = formatCurrency('0');
        });
        inputPercentFields.forEach(input => {
            input.value = formatPercent('0');
        });
    });

    function setCursorPosition(input) {
        let newPos = input.value.length - 2; // Posiciona o cursor antes do símbolo "%"
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(newPos, newPos);
        }
    }

    // Aplica o ajuste de posição do cursor após a entrada de dados
    document.querySelectorAll('.input-percent').forEach(input => {
        input.addEventListener('input', function() {
            let paddedNumber = input.value.replace(/\D/g, '').padStart(3, '0');
            input.value = paddedNumber.slice(0, -2) + "," + paddedNumber.slice(-2) + " %"; // Formata como XX,XX %
            setCursorPosition(input);
        });
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    // Função para rolar suavemente para o topo
    function smoothScrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Detecta quando a página está sendo recarregada
    window.addEventListener('beforeunload', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Verifica se a página foi recarregada
    if (performance.navigation.type === 1) {
        smoothScrollToTop();
    }

    document.body.classList.add('fade-in');

    
    const links = document.querySelectorAll('a.nav-link');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = link.getAttribute('href');
            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500); 
        });
    });

    // Redireciona para a página inicial ao recarregar ou pressionar F5
    window.addEventListener('beforeunload', function(event) {
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = "https://calculadorajoveminvestidor.com";
        }, 500); 
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
