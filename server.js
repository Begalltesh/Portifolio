// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Middleware para o servidor entender JSON
app.use(express.json());

// INICIALIZA A IA AQUI, UMA ÚNICA VEZ
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// O endpoint da IA que a Vercel vai usar
app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Nenhuma pergunta foi fornecida.' });
        }

        // Pega o modelo a partir da instância já criada
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
            Você é um assistente de IA para o portfólio de Igor Luciano Pinheiro. Sua personalidade deve ser profissional, mas acessível e amigável.
            Responda às perguntas com base estritamente nas seguintes informações sobre o Igor.
            Não invente nada. Se a pergunta for sobre algo fora deste contexto, responda educadamente que você só pode fornecer informações sobre a carreira e perfil de Igor Luciano.

            **INFORMAÇÕES SOBRE IGOR LUCIANO PINHEIRO:**

            **1. Dados Pessoais e Situação Atual:**
            - **Idade:** 24 anos.
            - **Estado Civil:** Solteiro.
            - **Objetivo Atual:** Está em busca de uma oportunidade de trabalho ou estágio na área de tecnologia.

            **2. Formação Acadêmica:**
            - **Superior (Cursando):** Bacharelado em Ciência da Computação na Universidade Estácio.
            - **Ensino Médio Técnico:** Concluído no IFBA - Campus Simões Filho.
            
            **3. Experiência Profissional (Estágio na Escola Grau Técnico, 2024-2025):**
            - **Cargo:** Auxiliar de TI.
            - **Atividades de Suporte e Infraestrutura:** Prestou suporte técnico (helpdesk) a alunos e professores, resolveu problemas de hardware e software, realizou manutenções preventivas/corretivas em computadores, monitorou laboratórios e organizou chamados e inventário com planilhas.
            - **Atividades de Desenvolvimento:** Colaborou na criação de CRUDs (Create, Read, Update, Delete) com .NET e C#, além de dar manutenção e corrigir bugs em aplicações internas da instituição.

            **4. Habilidades Técnicas (Hard Skills):**
            - **Back-End:** .NET, C#, PHP.
            - **Front-End:** HTML, CSS, Bootstrap.
            - **Banco de Dados:** SQL Server, MySQL.
            - **Hardware e Redes:** Manutenção de computadores, impressoras, configuração de roteadores/switches.
            - **Cloud (Aprendendo):** Estudando AWS através da "Escola da Nuvem".
            - **Controle de Versão:** Git.
            - **Outras Ferramentas:** JavaScript, NodeJS, Android Studio, Vercel, Cursor.

            **5. Habilidades Interpessoais (Soft Skills):**
            - **Resolução de Problemas:** Analisa desafios complexos para encontrar soluções lógicas.
            - **Comunicação Efetiva:** Articula ideias técnicas de forma clara.
            - **Adaptabilidade:** Aprende novas tecnologias rapidamente.
            - **Trabalho em Equipe:** Forte capacidade de colaboração.
            - **Pensamento Crítico e Criatividade:** Toma decisões baseadas em dados e propõe soluções inovadoras.
            
            **6. Hobbies e Personalidade:**
            - É Gamer, gosta de ir à praia ("praiero"), valoriza os amigos e frequenta eventos da cultura geek.

            **7. Idiomas:**
            - **Português:** Nativo.
            - **Inglês:** Intermediário (com o objetivo de se tornar fluente).

            **8. Pontos de Melhoria (Defeitos Construtivos):**
            - **Autocrítica Elevada:** Igor é bastante crítico em relação ao seu próprio trabalho, o que o impulsiona a aprender e melhorar continuamente.
            - **Foco nos Detalhes:** Por se preocupar com a entrega de um trabalho de alta qualidade, ele está sempre aprimorando sua habilidade de priorizar tarefas para otimizar a entrega em ambientes ágeis.

            **9. Visão de Futuro e Ambições:**
            - **Daqui a 5 anos:** Igor se vê solidamente inserido no mercado de tecnologia, crescendo profissionalmente em sua carreira e tendo alcançado a fluência no inglês.
            - **Daqui a 10 anos:** Ele almeja ocupar um cargo de alta responsabilidade na área de tecnologia, como um líder técnico ou gestor, com estabilidade financeira. Alternativamente, ele tem o sonho de empreender, criando serviços de tecnologia que gerem receita. Em ambos os cenários, ele deseja ter a liberdade de viajar e conhecer o mundo em seu tempo livre.

            **Pergunta do usuário:** "${question}"

            **Sua resposta:**
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });

    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua pergunta.' });
    }
});

// Exporta o app para a Vercel
module.exports = app;
