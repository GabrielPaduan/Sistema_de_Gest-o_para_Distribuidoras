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
import productLaunchRoutes from './routes/productLaunchRoutes.js';
import modeloContratoRoutes from './routes/modeloContratoRoutes.js';

dotenv.config();

const app = express();  
const port = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'https://sistema-de-comodato.web.app', 
        'https://sistema-de-comodato.firebaseapp.com', 
        'http://localhost:5173',
        'http://localhost:3000'  
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

app.use(express.json());

app.use('/clientes', clientRoutes);
app.use('/produtos', productRoutes);
app.use('/contratos', contractRoutes);
app.use('/pdfContratos', pdfRoutes);
app.use('/cadastro', userRoutes);
app.use('/snapshotProducts', snapshotProductsRoutes);
app.use('/categoriasProduto', productCategoriesRoutes);
app.use('/product-launches', productLaunchRoutes)
app.use('/modelosContrato', modeloContratoRoutes)

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta http://localhost:${port}`);
});
