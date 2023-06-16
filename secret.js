const fs = require('fs');

const clientSecretPath = 'C:/Users/clu/OneDrive/Documents/ChuckLU/GitHub/github-app-chuck20230613001-client-secret.txt'
const clientSecret = fs.readFileSync(clientSecretPath, 'utf8');

const privateKeyPath = 'C:/Users/clu/OneDrive/Documents/ChuckLU/GitHub/chuck20230613001.2023-06-12.private-key.pem';
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

module.exports = {
    clientSecret,
    privateKey,
}