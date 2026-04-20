require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 9648;

app.listen(PORT, () => {
  console.log(`StoreTech API running on port ${PORT}`);
});
