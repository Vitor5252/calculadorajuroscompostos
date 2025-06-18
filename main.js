document.addEventListener("DOMContentLoaded", function() {
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

    
    function removePlaceholder(e) {
        e.target.placeholder = "";
    }

    // Função para restaurar os placeholders se o campo estiver vazio
    function restorePlaceholder(e) {
        if (e.target.value === "") {
            if (e.target.id === "initialCapital" || e.target.id === "capitalByMonth" || e.target.id === "profitabilityPercent") {
                e.target.placeholder = "0,00";
            } else if (e.target.id === "time") {
                e.target.placeholder = "0";
            }
        }
    }

    // Adiciona os eventos de foco e desfoque aos campos de entrada
    document.getElementById('initialCapital').addEventListener('focus', removePlaceholder);
    document.getElementById('capitalByMonth').addEventListener('focus', removePlaceholder);
    document.getElementById('time').addEventListener('focus', removePlaceholder);
    document.getElementById('profitabilityPercent').addEventListener('focus', removePlaceholder);

    document.getElementById('initialCapital').addEventListener('blur', restorePlaceholder);
    document.getElementById('capitalByMonth').addEventListener('blur', restorePlaceholder);
    document.getElementById('time').addEventListener('blur', restorePlaceholder);
    document.getElementById('profitabilityPercent').addEventListener('blur', restorePlaceholder);
    
    // Função para remover formatação monetária e converter para número
    function parseCurrency(value) {
        return parseFloat(value.replace(/[R$\s\.]/g, '').replace(',', '.'));
    }

    // Cálculo de Juros Compostos
    var calculateButton = document.querySelector("#calculate");
    var cleanButton = document.querySelector("#clean");
    var undoButton = document.querySelector("#undo");

    const formatter = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

calculateButton.addEventListener("click", (e) => {
    e.preventDefault();
    var capitalInicial = parseCurrency(document.querySelector("#initialCapital").value) || 0;
    var investimentoMensal = parseCurrency(document.querySelector("#capitalByMonth").value) || 0;
    var tempo = parseInt(document.querySelector("#time").value) || 0;
    var rentabilidade = parseFloat(document.querySelector("#profitabilityPercent").value.replace(/,/g, '.')) || 0;
    var porAno = document.querySelector("#profitabilityYear").checked;
    var tempoEmMeses = tempo;

    if (document.querySelector("#timePeriodYears").checked) {
        tempoEmMeses = tempo * 12; // Converte anos em meses
    }

    if (porAno) {
        rentabilidade = rentabilidade / 12; // Converte taxa anual em mensal
    }

    rentabilidade /= 100; // Converte percentual para decimal

    var valorFinal = capitalInicial;
    var juros_compostos_total = 0;

    for (var i = 1; i <= tempoEmMeses; i++) {
        var juros_compostos = valorFinal * rentabilidade;
        juros_compostos_total += juros_compostos;
        valorFinal += investimentoMensal + juros_compostos;
    }

    var investimentoTotal = capitalInicial + (investimentoMensal * tempoEmMeses);
    var rendaMensalLiquida = valorFinal * rentabilidade * (1 - 0.225); // Desconta o imposto de 22,5%

    document.querySelector('.rs-total-investido').innerHTML = "R$ " + formatter.format(investimentoTotal);
    document.querySelector('.rs-juros').innerHTML = "R$ " + formatter.format(juros_compostos_total);
    document.querySelector('.rs-acumulado').innerHTML = "R$ " + formatter.format(valorFinal);
    document.querySelector('.rs-rent-income').innerHTML = "R$ " + formatter.format(rendaMensalLiquida);

    const resultSection = document.getElementById("result");
    resultSection.style.display = "block";

    // Força o navegador a reconhecer o novo layout
    resultSection.offsetHeight;

    setTimeout(() => {
        const headerOffset = 100;
        const elementPosition = resultSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }, 250); // delay aumentado de 125 → 250ms


    undoButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector('#result').style.display = "none";
        document.querySelector('#evaluate').style.display = "block";  
        $('html, body').animate({
            scrollTop: $("#evaluate").offset().top - window.innerHeight + $("#evaluate").outerHeight() / 2
        }, 50); 
    });

    cleanButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#initialCapital").value = "";
        document.querySelector("#capitalByMonth").value = "";
        document.querySelector("#time").value = "";
        document.querySelector("#profitabilityPercent").value = "";
        addPlaceholders(); 
    });

    document.body.classList.add('loaded');

    var cookieBanner = document.getElementById('cookie-banner');
    var acceptCookiesBtn = document.getElementById('accept-cookies');
    var rejectCookiesBtn = document.getElementById('reject-cookies');

    // Verificar se o usuário já aceitou/rejeitou os cookies anteriormente
    var cookiesAccepted = localStorage.getItem('cookiesAccepted');

    if (cookiesAccepted === 'true') {
        cookieBanner.style.display = 'none';
    } else if (cookiesAccepted === 'false') {
        
    } else {
        cookieBanner.style.display = 'block';
    }

    acceptCookiesBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
    });

    rejectCookiesBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieBanner.style.display = 'none';
    });

    // Adiciona a funcionalidade de scroll do cabeçalho
    window.addEventListener('scroll', function() {
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
