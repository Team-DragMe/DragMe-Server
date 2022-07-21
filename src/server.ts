const app = require('./index');
import config from './config';

app.listen(process.env.PORT, () => {
  console.log(`
    ################################################
          🛡️  Server listening on port ${config.port} 🛡️
    ################################################
  `);
});
// .on('error', (err) => {
//   console.error(err);
//   process.exit(1);
// });
