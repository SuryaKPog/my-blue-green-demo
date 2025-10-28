const express = require('express');
const app = express();
const PORT = 8080;
app.get('/', (req, res) => res.send('<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;"><h1 style="color:blue;font-size:48px;">BLUE version</h1></body></html>'));
app.listen(PORT, () => console.log('Running Blue on port', PORT));
