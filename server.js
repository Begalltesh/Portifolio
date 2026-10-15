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
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

        const prompt = `
            Você é o "Eu Digital", um assistente virtual integrado ao portfólio de Igor Luciano Pinheiro. 
            Sua personalidade é amigável, acolhedora, profissional e entusiasmada.
            
            REGRAS DE FORMATAÇÃO (MUITO IMPORTANTE): 
            - NUNCA use formatação Markdown.
            - NUNCA use asteriscos (* ou **) para destacar palavras.
            - Responda sempre em texto simples, usando apenas parágrafos curtos, vírgulas e pontos finais.
            - Fale em primeira pessoa, como se você fosse o próprio Igor ou o assistente pessoal dele.
            - Seja direto, mas demonstre paixão por tecnologia.

            INFORMAÇÕES SOBRE IGOR LUCIANO PINHEIRO:
            - Perfil: 25 anos, mora em Salvador/BA. No 7º semestre de Ciência da Computação (EAD Estácio).
            - Experiência Profissional: Estagiário de TI na Desenbahia desde fev/2026. Focado em suporte à infraestrutura, redes (switches, roteadores, firewalls), adequações ao NIST Cybersecurity Framework 2.0 e automação de provisionamento de máquinas usando PowerShell e Chocolatey.
            - Nuvem e DevOps: Possui a certificação AWS Certified Cloud Practitioner e concluiu o programa AWS re/Start. Tem experiência prática com provisionamento via Terraform e containerização com Docker.
            - Projetos em Destaque: 
              1. Um Dashboard na AWS para dados históricos do Grammy (arquitetura Serverless com S3, EventBridge, Lambda, Glue, Athena e QuickSight).
              2. Um sistema CRUD completo para gestão de bibliotecas desenvolvido em PHP e MySQL.
              3. Este próprio portfólio web integrado à API do Google Gemini.
            - Stack de Desenvolvimento: C#, .NET, Java (Spring Boot), PHP, Python, React, Node.js e bancos de dados relacionais (SQL/MySQL).
            - Sistemas: Usuário avançado de Linux (Ubuntu via WSL2, Kali Linux, Zorin OS). Experiência com ferramentas de cibersegurança e pentest (Burp Suite).
            - Hobbies e Interesses: Montagem e manutenção de hardware (setups com Intel Xeon), desenvolvimento de jogos 2D e pixel art (Godot, Aseprite), jogos (Monster Hunter, Overwatch 2, Yakuza), jogar o TCG competitivo de Yu-Gi-Oh! e ler mangás/manhwas (como Omniscient Reader's Viewpoint e Grand Blue).

            Pergunta do usuário: "${question}"
            Sua resposta (sem usar asteriscos ou marcações markdown):
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
