const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ],
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ Bot Online no Render!');
});

// Adicione o restante da sua lógica de menu aqui...

client.initialize();

// Armazena o "estágio" da conversa de cada usuário
const userState = {};

client.on("qr", (qr) => {
    console.log("📲 Escaneie o QR Code abaixo:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("✅ Barbearia 301 online!");
});

client.initialize();

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

client.on("message", async (msg) => {
    try {
        if (!msg.from || msg.from.endsWith("@g.us")) return;

        const chat = await msg.getChat();
        const texto = msg.body ? msg.body.trim().toLowerCase() : "";
        const contact = await msg.getContact();
        const firstName = contact.pushname ? contact.pushname.split(" ")[0] : "Amigo(a)";

        // Função para simular digitação e facilitar o reuso
        const sendTyping = async (text) => {
            await chat.sendStateTyping();
            await delay(2000);
            return client.sendMessage(msg.from, text);
        };

        // LÓGICA DE RESPOSTA
        if (/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite|301)$/i.test(texto)) {
            userState[msg.from] = "menu"; // Define que o usuário está no menu principal
            
            const saudacao = getSaudacao();
            await sendTyping(`${saudacao}, ${firstName}! 👋\nBem-vindo à *Barbearia 301*.\n\nComo posso ajudar hoje? Digite o número da opção:`);
            await delay(500);
            await client.sendMessage(msg.from, 
                "1️⃣ *Valores dos Serviços*\n" +
                "2️⃣ *Horários de Funcionamento*\n" +
                "3️⃣ *Localização*\n" +
                "4️⃣ *Agendamento*\n" +
                "5️⃣ *Falar com Atendente*"
            );
        } 
        
        else if (userState[msg.from] === "menu") {
            switch (texto) {
                case "1":
                    await sendTyping("📋 *Nossos Serviços:*\n\n• Cabelo: R$ 40,00\n• Barba: R$ 40,00\n• Combo (Cabelo + Barba): R$ 70,00\n• Sobrancelha: R$ 15,00");
                    break;
                case "2":
                    await sendTyping("⏰ *Horários:*\n\nSegunda a Sexta: 09h às 19h\nSábado: 09h às 18h\nDomingo: Fechado");
                    break;
                case "3":
                    await sendTyping("📍 *Onde estamos:*\nAlameda Gravatá Qd 301 Rua 'C' CNJ '1' - Centro.\n\nClique aqui para o GPS: https://maps.app.goo.gl/d5xMqeFzQbs4Kv2e7");
                    break;
                case "4":
                    await sendTyping("📅 *Agendamento:*\n\nTrabalhamos com o aplicativo *AppBarber Cliente*\n\n Ou acesse o App pelo link: https://sites.appbarber.com.br/barbearia301-xbu6");
                    break;
                case "5":
                    await sendTyping("Certo! Aguarde um instante, um de nossos barbeiros já vai te responder. 💈");
                    userState[msg.from] = "atendimento"; // Muda o estado para não repetir o menu
                    break;
                default:
                    await client.sendMessage(msg.from, "❌ Opção inválida. Digite apenas o número (1 a 5).");
            }
        }

    } catch (error) {
        console.error("❌ Erro:", error);
    }
});

function getSaudacao() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
}