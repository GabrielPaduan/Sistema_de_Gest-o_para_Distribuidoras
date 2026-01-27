// src/services/reportService.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ClientDTO, ContractDTO, ProductDTO, ProductsCategoriesDTO, SnapshotProductDTO } from "../utils/DTOS";
import logo from '../assets/logo_empresa.png';

export const generateReport = (client: ClientDTO, contracts: ContractDTO[], products: ProductDTO[], snapshotProducts: SnapshotProductDTO[], categorias: ProductsCategoriesDTO[]) => {
    // Aumentar o padrão para A4 se não estiver
    const doc = new jsPDF('p', 'mm', 'a4'); 
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10; // Margem menor para aproveitar espaço

    // --- CABEÇALHO PROFISSIONAL ---
    doc.addImage(logo, 'PNG', pageWidth - margin - 30, margin, 30, 30);

    // Nome da Empresa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14); // Levemente menor
    doc.text("O REI DO ÓLEO", pageWidth - margin, margin + 40, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text("reidooleodistribuidora@gmail.com", pageWidth - margin, margin + 45, { align: 'right' });
    doc.text("(43) 98488-0539", pageWidth - margin, margin + 49, { align: 'right' });

    // Dados do Cliente
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("CLIENTE:", margin, margin + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(client.cli_razaoSocial || "Razão Social não informada", margin, margin + 15);
    doc.text(client.cli_end || "Endereço não informado", margin, margin + 20);
    doc.text(client.cli_cidade ? `${client.cli_cidade} ${client.cli_uf}` : "Cidade não informada", margin, margin + 25);
    doc.text(client.cli_email || "Email não informado", margin, margin + 30);
    doc.text(client.cli_dddTel && client.cli_telefone ? `Tel: (${client.cli_dddTel}) ${client.cli_telefone}` : "Telefone não informado", margin, margin + 35);
    doc.text(`Responsável: ${client.cli_responsavel || "não informado"}`, margin, margin + 40);

    // Linha divisória
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, margin + 55, pageWidth - margin, margin + 55);
    
    let y = margin + 65;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('INFORMAÇÕES DO CONTRATO', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // --- PREPARAÇÃO DOS DADOS ---
    // Colunas Reduzidas para caber lado a lado (Removi "Valor Unitário" para economizar espaço se necessário, mas vou tentar manter)
    // Se ficar apertado, remova a coluna Categoria ou Valor Unitário
    const tableColumn = ["CMDT", "PRODUTO", "CATEGORIA", "QTD", "TOTAL"]; 
    
    let allRows: any[] = [];
    
    // Lógica para popular as linhas (mantida a sua lógica original de sort e map)
    const dataToMap = snapshotProducts.length === 0 ? contracts.sort((a, b) => {
             const productA = products.find(p => p.ID_Prod === a.Cont_ID_Prod);
             const productB = products.find(p => p.ID_Prod === b.Cont_ID_Prod);
             const prateleiraA = categorias.find(cat => cat.ID_CategoriaProduto === productA?.Prod_Categoria)?.Cat_Prateleira || 0;
             const prateleiraB = categorias.find(cat => cat.ID_CategoriaProduto === productB?.Prod_Categoria)?.Cat_Prateleira || 0;
             if (prateleiraA - prateleiraB === 0) {
                 return productA?.Prod_CodProduto.localeCompare(productB?.Prod_CodProduto || "") || 0;
             }
             return prateleiraA - prateleiraB;
         }) : snapshotProducts;

    if (snapshotProducts.length === 0) {
        allRows = (dataToMap as ContractDTO[]).map(contract => {
            const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
            const valorTotal = (contract?.Cont_Qtde ?? 0) * (product?.Prod_Valor ?? 0);
            return [
                contract.Cont_Comodato,
                product?.Prod_CodProduto || 'ND',
                categorias.find(cat => cat.ID_CategoriaProduto === product?.Prod_Categoria)?.CatProd_Nome,
                contract?.Cont_Qtde ?? 0,
                `R$ ${valorTotal.toFixed(2)}`
            ];
        });
    } else {
        allRows = (dataToMap as SnapshotProductDTO[]).map(snapshot => {
            return [
                snapshot.snapshot_comodato,
                snapshot.snapshot_prod_cod || 'ND',
                categorias.find(cat => cat.ID_CategoriaProduto === snapshot.snapshot_prod_cat)?.CatProd_Nome,
                snapshot.snapshot_qtde || 0,
                `R$ ${snapshot.snapshot_valor_total_item?.toFixed(2) || '0.00'}`
            ];
        });
    }

    // --- LÓGICA DE DIVISÃO ---
  const SPLIT_THRESHOLD = 15; 
    const shouldSplit = allRows.length > SPLIT_THRESHOLD;

    // Configurações comuns
    const tableStyles = {
        theme: 'striped' as const,
        headStyles: { fillColor: [0, 0, 139] as [number, number, number], fontStyle: 'bold' as const, fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        styles: { halign: 'center' as const, cellPadding: 1 },
        columnStyles: { 1: { halign: 'left' as const } }
    };

    let finalY = y;

    if (shouldSplit) {
        const midpoint = Math.ceil(allRows.length / 2);
        const rowsLeft = allRows.slice(0, midpoint);
        const rowsRight = allRows.slice(midpoint);

        const tableWidth = (pageWidth - (margin * 2) - 5) / 2;
        
        // CORREÇÃO 1: Usamos (doc as any) para acessar a propriedade interna sem erro
        const startPage = (doc as any).internal.getCurrentPageInfo().pageNumber;

        // 2. Desenha a Tabela da Esquerda
        autoTable(doc, {
            ...tableStyles,
            head: [tableColumn],
            body: rowsLeft,
            startY: y,
            margin: { left: margin },
            tableWidth: tableWidth
        });

        const finalYLeft = (doc as any).lastAutoTable.finalY;
        // CORREÇÃO 2: Mesmo cast aqui
        const endPageLeft = (doc as any).internal.getCurrentPageInfo().pageNumber;

        // 3. Volta para a página inicial
        doc.setPage(startPage);

        // 4. Desenha a Tabela da Direita
        autoTable(doc, {
            ...tableStyles,
            head: [tableColumn],
            body: rowsRight,
            startY: y, 
            margin: { left: margin + tableWidth + 5 },
            tableWidth: tableWidth
        });
        
        const finalYRight = (doc as any).lastAutoTable.finalY;
        // CORREÇÃO 3: Mesmo cast aqui
        const endPageRight = (doc as any).internal.getCurrentPageInfo().pageNumber;

        // 5. Sincronização Final
        const maxPage = Math.max(endPageLeft, endPageRight);
        
        doc.setPage(maxPage);

        if (endPageLeft === endPageRight) {
            finalY = Math.max(finalYLeft, finalYRight);
        } else if (endPageLeft > endPageRight) {
            finalY = finalYLeft;
        } else {
            finalY = finalYRight;
        }

    } else {
        // Renderização padrão (coluna única)
        autoTable(doc, {
            ...tableStyles,
            head: [tableColumn],
            body: allRows,
            startY: y,
            margin: { left: margin, right: margin }
        });
        finalY = (doc as any).lastAutoTable.finalY;
    }


    // --- RODAPÉ COM TOTAIS ---
    const totalGeral = snapshotProducts.length === 0 ? contracts.reduce((sum, contract) => {
        const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
        return sum + ((contract?.Cont_Qtde ?? 0) * (product?.Prod_Valor ?? 0));
    }, 0) : snapshotProducts.reduce((sum, snapshot) => {
        return sum + (snapshot.snapshot_valor_total_item || 0)
    }, 0);

    // Verifica se precisa nova página para o total
    if (finalY + 30 > pageHeight) {
        doc.addPage();
        finalY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("VALOR TOTAL:", pageWidth - margin - 50, finalY + 10);
    doc.setFontSize(12);
    doc.text(`R$ ${totalGeral.toFixed(2)}`, pageWidth - margin, finalY + 10, { align: 'right' });

    // Rodapé fixo na parte inferior
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Responsável: Tiago Cernev Neves`, margin, pageHeight - 10);
    doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    doc.save(`relatorio-${client.cli_razaoSocial?.replace(/\s+/g, '-') || 'cliente'}.pdf`);
}