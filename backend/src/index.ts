import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes.js';
import productRoutes from './routes/productRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import userRoutes from './routes/userRoutes.js';
import snapshotProductsRoutes from './routes/snapshotProductsRoutes.js';
import productCategoriesRoutes from './routes/productsCategoriesRoutes.js';

dotenv.config();

const app = express();  
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Registra os grupos de rotas
app.use('/clientes', clientRoutes);
app.use('/produtos', productRoutes);
app.use('/contratos', contractRoutes);
app.use('/pdfContratos', pdfRoutes);
app.use('/cadastro', userRoutes);
app.use('/snapshotProducts', snapshotProductsRoutes);
app.use('/categoriasProduto', productCategoriesRoutes);

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta http://localhost:${port}`);
});
