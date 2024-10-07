import express from 'express';
import { Config } from '../core/config';
import { RKE2RancherInstaller } from '../core/installer';

const app = express();
app.use(express.json());

app.post('/install', async (req, res) => {
  const config: Config = req.body;
  const installer = new RKE2RancherInstaller(config);
  
  try {
    await installer.install();
    res.status(200).json({ message: 'Installation completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Installation failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});