const http = require('http');
const bodyParser = require('body-parser');
//const qrcode = require('qrcode-terminal');
const socketIo = require('socket.io');
const QRCode = require('qrcode');
const express = require('express');
const cors = require('cors');
const { Client, Buttons, List, MessageMedia, LocalAuth } = require('whatsapp-web.js');
require('dotenv').config();

// Gere o seu token 32 caracteres
const SECURITY_TOKEN = "a9387747d4069f22fca5903858cdda24";

const sessao = "sendMessage";

const app = express();
const server = http.createServer(app);

const port = 8888;

app.use(cors());
app.use(express.static('public'));
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configurações para o primeiro cliente (Windows)
/*const client = new Client({
    authStrategy: new LocalAuth({ clientId: sessao }),
    puppeteer: {
      executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    }
});*/
  
  //Kit com os comandos otimizados para nuvem Ubuntu Linux (créditos Pedrinho da Nasa Comunidade ZDG)
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: sessao }),
    puppeteer: {
      headless: true,
      //CAMINHO DO CHROME PARA WINDOWS (REMOVER O COMENTÁRIO ABAIXO)
      //executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      //===================================================================================
      // CAMINHO DO CHROME PARA MAC (REMOVER O COMENTÁRIO ABAIXO)
      //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      //===================================================================================
      // CAMINHO DO CHROME PARA LINUX (REMOVER O COMENTÁRIO ABAIXO)
       executablePath: '/usr/bin/google-chrome-stable',
      //===================================================================================
      args: [
        '--no-sandbox', //Necessário para sistemas Linux
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- Este não funciona no Windows, apague caso suba numa máquina Windows
        '--disable-gpu'
      ]
    }
  });

  const appQR = express();
  const serverQR = http.createServer(appQR);
  const io = socketIo(serverQR);

  const portQR = 8003;

  appQR.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/sendMessageQR.html');
  });
    
  // Evento 'qr' - já fornecido anteriormente
client.on('qr', qr => {
    console.log('qr gerado');
    QRCode.toDataURL(qr, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Erro ao gerar QR code', err);
        return;
      }
      io.emit('qr code', url);
    });
  });
  
  // Evento 'ready'
  client.on('ready', () => {
    console.log('API de endpoint sendMessage pronta e conectada.');
    io.emit('connection-ready', 'API pronta e conectada.');
  });
  
  // Evento 'authenticated'
  client.on('authenticated', () => {
    console.log('Autenticação bem-sucedida.');
    io.emit('authenticated', 'Autenticação bem-sucedida.');
  });
  
  client.on('disconnected', (reason) => {
    console.log(`Cliente desconectado: ${reason}`);
    io.emit('disconnected', `Cliente desconectado: ${reason}`);

    if (reason === 'NAVIGATION') {
        console.log('Reconectando instância e gerando novo QR code...');
        client.destroy().then(() => {
            client.initialize(); // Inicia uma nova instância
        });
    } else {
        console.log('Razão de desconexão não requer a geração de um novo QR code.');
    }
  });

  client.initialize();

  io.on('connection', (socket) => {
    console.log('Um usuário se conectou');     
    socket.on('disconnect', () => {
      console.log('Usuário desconectou');
    });
  });
  
  serverQR.listen(portQR, () => {
    console.log(`Servidor rodando em http://localhost:${portQR}`);
  });

app.post('/sendMessage', async (req, res) => {
    const { destinatario, mensagem, tipo, msg, media, token } = req.body;

    // Obter o endereço IP do cliente que faz a requisição
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Verifique se o pedido não vem do localhost
    if (clientIp !== '127.0.0.1' && clientIp !== '::1') {
        // Verificar se o token é válido
        if (token !== SECURITY_TOKEN) {
            return res.status(401).json({ status: 'falha', mensagem: 'Token inválido' });
        }
    }

    if (!client || !client.info) {
        return res.status(402).json({status: 'falha', message: 'Cliente Não Autenticado'});
    }

    if (!destinatario || !tipo) {
        return res.status(400).json({ status: 'falha', mensagem: 'Destinatario e tipo são obrigatórios' });
    }    

    try {
        const chatId = destinatario;

        switch (tipo) {
            case 'text':
                if (!mensagem) {
                    return res.status(400).json({ status: 'falha', mensagem: 'É preciso fornecer uma mensagem' });
                }
                await client.sendMessage(chatId, mensagem);
                break;
            case 'image':
                if (!media) {
                    return res.status(400).json({ status: 'falha', mensagem: 'É preciso fornecer uma midia' });
                }                
                await client.sendMessage(chatId, new MessageMedia(media.mimetype, media.data, media.filename));
                break;
            case 'video':
                if (!media) {
                    return res.status(400).json({ status: 'falha', mensagem: 'É preciso fornecer uma midia' });
                }
                await client.sendMessage(chatId, new MessageMedia(media.mimetype, media.data, media.filename));
                break;
            case 'audio':
                if (!media) {
                    return res.status(400).json({ status: 'falha', mensagem: 'É preciso fornecer uma midia' });
                }
                await client.sendMessage(chatId, new MessageMedia(media.mimetype, media.data, media.filename), {sendAudioAsVoice: true});
                break;
            case 'file':
                if (!media) {
                    return res.status(400).json({ status: 'falha', mensagem: 'É preciso fornecer uma midia' });
                }
                await client.sendMessage(chatId, new MessageMedia(media.mimetype, media.data, media.filename));
                break;
            default:
                return res.status(400).json({ status: 'falha', mensagem: 'Tipo de mensagem inválido' });
        }

        res.status(200).json({ status: 'sucesso', mensagem: 'Mensagem enviada com sucesso'});
    } catch (error) {
        console.error(error);        
        res.status(500).json({ status: 'falha', mensagem: 'Erro ao enviar mensagem' });
    }
});

server.listen(port, () => {
    console.log(`Servidor sendMessage rodando em http://localhost:${port}`);
});