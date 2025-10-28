const express = require('express');
const app = express();
const PORT = 8080;
app.get('/', (req, res) => res.send('<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;"><h1 style="color:green;font-size:48px;">GREEN version</h1></body></html>'));
app.listen(PORT, () => console.log('Running Green on port', PORT));
