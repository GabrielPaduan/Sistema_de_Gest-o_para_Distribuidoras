// src/services/reportService.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ClientDTO, ContractDTO, ProductDTO, ProductsCategoriesDTO, SnapshotProductDTO } from "../utils/DTOS";
import logo from '../assets/logo_empresa.png'// Verifique se o caminho da logo está correto

export const generateReport = (client: ClientDTO, contracts: ContractDTO[], products: ProductDTO[], snapshotProducts: SnapshotProductDTO[], categorias: ProductsCategoriesDTO[]) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    console.log("Generating report with snapshotProducts:", snapshotProducts);

    // --- CABEÇALHO PROFISSIONAL ---
    // Logo
    doc.addImage(logo, 'PNG', doc.internal.pageSize.width - margin - 35, margin, 35, 35);

    // Nome da Empresa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text("O REI DO ÓLEO", doc.internal.pageSize.width - margin, margin + 45, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("reidooleodistribuidora@gmail.com", doc.internal.pageSize.width - margin, margin + 50, { align: 'right' });
    doc.text("(43) 98488-0539", doc.internal.pageSize.width - margin, margin + 54, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("CLIENTE:", margin, margin + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(client.cli_razaoSocial || "Razão Social não informada", margin, margin + 16);
    doc.text(client.cli_end || "Endereço não informado", margin, margin + 22);
    doc.text(client.cli_cidade ? `${client.cli_cidade} ${client.cli_uf}` : "Cidade não informada", margin, margin + 28);
    doc.text(client.cli_email || "Email não informado", margin, margin + 34);

    // Linha divisória
    doc.setDrawColor(180, 180, 180);
    doc.line(margin, margin + 60, doc.internal.pageSize.width - margin, margin + 60);
    
    let y = margin + 80;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('INFORMAÇÕES DO CONTRATO', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 15;

    // --- TABELA DE PRODUTOS ---
    const tableColumn = ["CMDT", "PRODUTOS", "CATEGORIA", "VALOR UNITÁRIO", "QUANTIDADE", "VALOR TOTAL"];
    let tableRows: any[] = [];
    if (snapshotProducts.length === 0) {
        tableRows = contracts.map(contract => {
            const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
            const valorTotal = (contract?.Cont_Qtde ?? 0) * (product?.Prod_Valor ?? 0);
            return [
                contract.Cont_Comodato,
                product?.Prod_Nome ?? 'Produto não encontrado',
                categorias.find(cat => cat.ID_CategoriaProduto === product?.Prod_Categoria)?.CatProd_Nome || 'Categoria não encontrada',
                `R$ ${product?.Prod_Valor?.toFixed(2) ?? '0.00'}`,
                contract?.Cont_Qtde ?? 0,
                `R$ ${valorTotal.toFixed(2)}`
            ];
        });
    } else {
        tableRows = snapshotProducts.map(snapshot => {
            return [
                snapshot.snapshot_comodato,
                snapshot.snapshot_prod_cod || 'Produto não encontrado',
                categorias.find(cat => cat.ID_CategoriaProduto === snapshot.snapshot_prod_cat)?.CatProd_Nome || 'Categoria não encontrada',
                `R$ ${snapshot.snapshot_valor_unitario?.toFixed(2) || '0.00'}`,
                snapshot.snapshot_qtde || 0,
                `R$ ${snapshot.snapshot_valor_total_item?.toFixed(2) || '0.00'}`
            ];
        });
    }

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: y,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 139], fontStyle: 'bold' }, // Azul escuro
        styles: { halign: 'center' },
        columnStyles: { 1: { halign: 'left' } } // Alinha a coluna de produtos à esquerda
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // --- RODAPÉ COM TOTAIS E INFORMAÇÕES ADICIONAIS ---)
    const totalGeral = snapshotProducts.length === 0 ? contracts.reduce((sum, contract) => {
        const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
        return sum + ((contract?.Cont_Qtde ?? 0) * (product?.Prod_Valor ?? 0));
    }, 0) : snapshotProducts.reduce((sum, snapshot) => {
        return sum + (snapshot.snapshot_valor_total_item || 0)
        }, 0);

    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("VALOR TOTAL:", doc.internal.pageSize.width - margin - 60  , finalY + 20);
    doc.setFontSize(16);
    doc.text(`R$ ${totalGeral.toFixed(2)}`, doc.internal.pageSize.width - margin, finalY + 20, { align: 'right' });

    // Linha do Rodapé
    doc.line(margin, pageHeight - 30, doc.internal.pageSize.width - margin, pageHeight - 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Responsável: Tiago Cernev Neves`, margin, pageHeight - 20);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, doc.internal.pageSize.width - margin, pageHeight - 20, { align: 'right' });

    // --- SALVAR O ARQUIVO ---
    doc.save(`relatorio-${client.cli_razaoSocial?.replace(/\s+/g, '-') || 'cliente'}.pdf`);
}