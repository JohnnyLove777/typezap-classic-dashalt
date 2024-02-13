const { exec } = require('child_process');
const http = require('http');

// Função para obter o URL público do ngrok
function getNgrokUrl() {
  setTimeout(() => {
    http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data).tunnels;
          const httpsTunnel = tunnels.find(tunnel => tunnel.proto === 'https');
          if (httpsTunnel) {
            console.log(`Ngrok URL: ${httpsTunnel.public_url}`);
          } else {
            console.log('Ngrok HTTPS tunnel not found.');
          }
        } catch (error) {
          console.error('Error parsing ngrok response:', error);
        }
      });
    }).on('error', (error) => {
      console.error('Error making request to ngrok API:', error);
    });
  }, 10000); // Espera 10 segundos para o ngrok inicializar completamente
}

// Inicia o ngrok e obtém o URL
const ngrokProcess = exec('ngrok http 8888');

ngrokProcess.stdout.on('data', (data) => {
  console.log(data); // Opcional: Exibe saída do ngrok no console
});

ngrokProcess.stderr.on('data', (data) => {
  console.error(data);
});

ngrokProcess.on('exit', (code) => {
  console.log(`Ngrok process exited with code ${code}`);
});

// Chama a função para obter o URL após um delay, garantindo que o ngrok tenha tempo de inicializar
getNgrokUrl();
