document.addEventListener('DOMContentLoaded', function() {
    
    
    const texto = "Oi, eu sou Igor Luciano, Desenvolvedor Full-Stack, Estudante e Gamer.";
    const elementoTexto = document.getElementById('texto-animado');
    let index = 0;

    function digitar() {
        if (elementoTexto && index < texto.length) {
            elementoTexto.textContent += texto.charAt(index);
            index++;
            setTimeout(digitar, 80); 
        }
    }
    
    if (elementoTexto) {
        digitar();
    }

    const navbar = document.getElementById('navbar-principal');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
    
    if (navbar) {
        handleScroll();
        window.addEventListener('scroll', handleScroll);
    }

    const perguntaInput = document.getElementById('pergunta-usuario');
    const btnEnviar = document.getElementById('btn-enviar-pergunta');
    const areaResposta = document.getElementById('area-resposta');
    const textoResposta = document.getElementById('texto-resposta-ia');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    async function fazerPergunta() {
        const pergunta = perguntaInput.value.trim();
        if (!pergunta) {
            alert('Por favor, digite uma pergunta.');
            return;
        }

        btnText.textContent = 'Pensando...';
        btnSpinner.classList.remove('d-none');
        btnEnviar.disabled = true;
        areaResposta.style.display = 'none';

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: pergunta }),
            });

            if (!response.ok) {
                throw new Error('A resposta do servidor não foi OK.');
            }

            const data = await response.json();
            textoResposta.textContent = data.answer;
            areaResposta.style.display = 'block';

        } catch (error) {
            console.error('Erro ao fazer a pergunta:', error);
            textoResposta.textContent = 'Desculpe, não consegui me conectar com minha inteligência. Tente novamente mais tarde.';
            areaResposta.style.display = 'block';
        } finally {
            btnText.textContent = 'Enviar';
            btnSpinner.classList.add('d-none');
            btnEnviar.disabled = false;
        }
    }

    if (btnEnviar && perguntaInput) {
        btnEnviar.addEventListener('click', fazerPergunta);
        perguntaInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                fazerPergunta();
            }
        });
    }

    const emailLink = document.getElementById('email-link');
    const copiadoToast = document.getElementById('copiado-toast');
    const emailParaCopiar = "igorluciano2001@gmail.com"; 

    if (emailLink) {
        emailLink.addEventListener('click', function(event) {
            event.preventDefault();

            navigator.clipboard.writeText(emailParaCopiar).then(() => {
                copiadoToast.textContent = 'Email copiado!';
                copiadoToast.style.backgroundColor = ''; 
                copiadoToast.classList.add('show');

                setTimeout(() => {
                    copiadoToast.classList.remove('show');
                }, 3000);

            }).catch(err => {
                console.error('Erro ao copiar e-mail: ', err);
                copiadoToast.textContent = 'Erro ao copiar!';
                copiadoToast.style.backgroundColor = '#d9534f'; 
                copiadoToast.classList.add('show');

                 setTimeout(() => {
                    copiadoToast.classList.remove('show');
                    copiadoToast.style.backgroundColor = ''; 
                }, 3000);
            });
        });
    }

}); 