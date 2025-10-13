import { Navigate, Route, Routes } from "react-router-dom";
import { Principal } from "../pages/principal/Principal";
import { CadastroCliente } from "../pages/cadastroCliente/CadastroCliente";
import { VisualizarClientes } from "../pages/visualizarClientes/VisualizarClientes";
import { ContratoCliente } from "../pages/contratoCliente/contratoCliente";
import { Login } from "../pages/login/Login";
import { HistoricoContratos } from "../pages/HistoricoContratos/HistoricoContratos";
import { CadastroUser } from "../pages/cadastroUser/CadastroUser";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { EstoqueProdutos } from "../pages/estoqueProdutos/EstoqueProdutos";
import { CadastroProduto } from "../pages/cadastroProduto/CadastroProduto";
import { EditarProduto } from "../pages/editarProduto/EditarProduto";
import { EditarCliente } from "../pages/editarCliente/EditarCliente";

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/pagina-inicial" element={<ProtectedRoute><Principal /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Navigate to="/login"/>} />
        <Route path="/cadastro-clientes" element={<ProtectedRoute> <CadastroCliente /></ProtectedRoute>} />
        <Route path="/visualizar-clientes" element={<ProtectedRoute><VisualizarClientes /></ProtectedRoute>} />
        <Route path="/contrato-cliente/:id" element={<ProtectedRoute><ContratoCliente /></ProtectedRoute>} />
        <Route path="/historico-contratos" element={<ProtectedRoute><HistoricoContratos /></ProtectedRoute>} />
        <Route path="/cadastro-user" element={<ProtectedRoute><CadastroUser /></ProtectedRoute>} />
        <Route path="/estoque-produtos" element={<ProtectedRoute><EstoqueProdutos /></ProtectedRoute>} />
        <Route path="/cadastro-produto" element={<ProtectedRoute><CadastroProduto /></ProtectedRoute>} /> 
        <Route path="/editar-produto/:id" element={<ProtectedRoute><EditarProduto /></ProtectedRoute>} />
        <Route path="/editar-cliente/:id" element={<ProtectedRoute><EditarCliente /></ProtectedRoute>} />
    </Routes>
 );
}