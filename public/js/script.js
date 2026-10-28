document.addEventListener('DOMContentLoaded', function() {
    
    
    const texto = "Oi, eu sou Igor Luciano, Estudante, Devops e Gamer.";
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

// ==========================================
// ANIMAÇÃO DAS BOLAS COM MATTER.JS (Fundo Início)
// ==========================================
window.addEventListener('load', function() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Events = Matter.Events;

    const engine = Engine.create();
    const world = engine.world;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: width,
            height: height,
            background: 'transparent',
            wireframes: false,
            pixelRatio: window.devicePixelRatio
        }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const floorY = height - 120;
    
    const ground = Bodies.rectangle(width / 2, floorY + 50, width, 100, { 
        isStatic: true,
        render: { visible: false }
    });
    
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true });

    World.add(world, [ground, leftWall, rightWall]);

    // Lista de tecnologias com a AWS em branco (%23ffffff)
    const techLogos = [
            'https://unpkg.com/devicon@2.16.0/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
            'https://unpkg.com/devicon@2.16.0/icons/nodejs/nodejs-original-wordmark.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
        ];
    const bolas = [];
    const raioBola = 80; // Bolas grandes e imponentes

    const imageCache = {};
    techLogos.forEach(logo => {
        const img = new Image();
        img.src = logo;
        imageCache[logo] = img;
    });

    techLogos.forEach((logo, index) => {
        let x = Math.random() * (width - 300) + 150;
        let y = - (Math.random() * 500) - (index * 100) - 100;

        let bola = Bodies.circle(x, y, raioBola, {
            restitution: 0.9, 
            friction: 0.001,
            frictionAir: 0.01,
            density: 0.05,
            logoUrl: logo,
            render: {
                fillStyle: '#1a2024', // Cor de fundo das bolas compatível com o CSS
                strokeStyle: '#2a343b', 
                lineWidth: 2
            }
        });
        bolas.push(bola);
    });

    World.add(world, bolas);

    Events.on(render, 'afterRender', function() {
        const ctx = render.context;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, floorY, width, height - floorY);
        ctx.clip();

        bolas.forEach(bola => {
            const distToFloor = floorY - bola.position.y;
            
            if (distToFloor < 300) {
                const mirroredY = floorY + distToFloor;

                ctx.save();
                ctx.translate(bola.position.x, mirroredY);
                ctx.scale(1, -1);
                ctx.rotate(-bola.angle);

                ctx.beginPath();
                ctx.arc(0, 0, raioBola, 0, 2 * Math.PI);
                ctx.fillStyle = '#1a2024';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#2a343b';
                ctx.stroke();

                const logoUrl = bola.logoUrl;
                if (logoUrl) {
                    const img = imageCache[logoUrl];
                    if (img && img.complete && img.naturalWidth !== 0) {
                        const size = raioBola * 1.3;
                        ctx.drawImage(img, -size/2, -size/2, size, size);
                    }
                }
                ctx.restore();
            }
        });

        const grad = ctx.createLinearGradient(0, floorY, 0, height);
        grad.addColorStop(0, 'rgba(18, 24, 27, 0.4)');
        grad.addColorStop(1, 'rgba(18, 24, 27, 1)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, floorY, width, height - floorY);

        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(width, floorY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore(); 

        bolas.forEach(bola => {
            const logoUrl = bola.logoUrl;
            if (logoUrl) {
                const img = imageCache[logoUrl];
                if (img && img.complete && img.naturalWidth !== 0) {
                    const size = raioBola * 1.3;
                    ctx.save();
                    ctx.translate(bola.position.x, bola.position.y);
                    ctx.rotate(bola.angle);
                    ctx.drawImage(img, -size/2, -size/2, size, size);
                    ctx.restore();
                }
            }
        });
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    World.add(world, mouseConstraint);
    render.mouse = mouse; 

    window.addEventListener('resize', () => {
        width = container.clientWidth;
        height = container.clientHeight;
        
        render.canvas.width = width;
        render.canvas.height = height;
        render.options.width = width;
        render.options.height = height;
        
        const newFloorY = height - 120;
        Matter.Body.setPosition(ground, { x: width / 2, y: newFloorY + 50 });
        Matter.Body.setPosition(leftWall, { x: -25, y: height / 2 });
        Matter.Body.setPosition(rightWall, { x: width + 25, y: height / 2 });
    });
});