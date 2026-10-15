// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
    console.error("ERRO CRÍTICO: A GEMINI_API_KEY não foi encontrada nas variáveis da Vercel.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        console.log("1. Pergunta recebida do site:", question);

        if (!question) {
            return res.status(400).json({ error: 'Nenhuma pergunta foi fornecida.' });
        }

        console.log("2. A preparar o modelo gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
            Você é um assistente de IA focado exclusivamente no portfólio de Igor Luciano Pinheiro. Sua personalidade deve ser profissional, técnica, acessível e objetiva, visando atrair recrutadores e parceiros de projeto.
            Responda às perguntas com base estritamente nas seguintes informações sobre o Igor. 
            Não invente absolutamente nada. Se a pergunta for sobre algo fora deste contexto, responda educadamente que você é configurado apenas para fornecer informações sobre a carreira, habilidades e perfil do Igor.

            **INFORMAÇÕES SOBRE IGOR LUCIANO PINHEIRO:**
            - **Idade/Local:** 25 anos, Salvador/BA.
            - **Estudos:** 6º Semestre Ciência da Computação (Estácio). Concluiu AWS re/Start pela Escola da Nuvem.
            - **Certificação:** AWS Certified Cloud Practitioner.
            - **Emprego Atual:** Estágio de TI na Desenbahia (Fevereiro/2026 - Atual). Suporte à infraestrutura, redes (switches, roteadores, firewalls) e provisionamento padronizado utilizando PowerShell, arquivos .bat e Chocolatey.
            - **Habilidades:** AWS, DevOps, Docker, Terraform, Redes, Linux (WSL2, Ubuntu, Kali), C#, .NET, PHP, React, Node.js, Python, Bancos de Dados (SQL/MySQL).
            - **Hobbies:** Jogar (PC/Mobile com controle GameSir), TCG de Yu-Gi-Oh!, cultura geek, montagem de hardware e sair com amigos.
            - **Idiomas:** Português (Nativo), Inglês (Intermediário).

            **Pergunta do usuário:** "${question}"
            **Sua resposta:**
        `;
        
        console.log("3. A enviar para a Google. A aguardar resposta...");
        const result = await model.generateContent(prompt);
        
        console.log("4. Resposta recebida da Google!");
        const response = await result.response;
        const text = response.text();

        console.log("5. A enviar resposta para o site.");
        res.json({ answer: text });

    } catch (error) {
        console.error('ERRO NA API DO GEMINI:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao conectar com o modelo de IA.' });
    }
});

module.exports = app;
