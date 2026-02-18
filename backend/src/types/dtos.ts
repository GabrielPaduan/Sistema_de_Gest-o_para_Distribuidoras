export interface ClientDTO {
    id: number;
    cli_razaoSocial: string;
    cli_email: string;
    cli_doc: string;
    cli_typeDoc: number;
    cli_end: string;
    cli_cep: string;   
    cli_dddTel: string;
    cli_telefone: string;
    cli_dddCel: string;
    cli_cidade: string;
    cli_celular: string;
    cli_endNum: string;
    cli_bairro: string;
    cli_uf: string;
    cli_insEstadual: string;
    cli_responsavel: string;
    cli_ClienteAtivo: boolean;
}

export interface ClientDTOInsert {
    cli_razaoSocial: string;
    cli_email: string;
    cli_doc: string;
    cli_typeDoc: number;
    cli_end: string;
    cli_cep: string;   
    cli_dddTel: string;
    cli_telefone: string;
    cli_dddCel: string;
    cli_cidade: string;
    cli_celular: string;
    cli_endNum: string;
    cli_bairro: string;
    cli_uf: string;
    cli_insEstadual: string;
    cli_responsavel: string;
    cli_ClienteAtivo: boolean;
}

export interface ProductDTO {
    ID_Prod: number;
    Prod_Valor: number;
    Prod_CustoCompra: number;
    Prod_CFOP: string;
    Prod_NCM: number;
    Prod_UnMedida: string;
    Prod_CodProduto: string;
    Prod_CodBarras: string;
    Prod_Nome: string;
    Prod_Estoque: number;
    Prod_PorcLucro: number;
    Prod_Categoria: number;
}

export interface ContractDTO {
    ID_Contrato: number;
    Cont_ID_Cli: number;
    Cont_ID_Prod: number;
    Cont_Comodato: number;
    Cont_Qtde: number;
    Cont_ValorTotal: number;
    Cont_PorcLucro: number;
}

export interface PdfStructDTO {
    id: number;
    PDF_Client_Id: number;
    PDF_Status: number;
    PDF_Generated_Date: string;
    PDF_Observacoes: string;
    PDF_Valor: number;
    PDF_ValorPago: number;
}

export interface PdfStructInsertDTO {
    PDF_Client_Id: number;
    PDF_Status: number;
    PDF_Generated_Date: string;
    PDF_Observacoes: string;
    PDF_Valor: number;
    PDF_ValorPago: number;
}

export interface UserDTO {
    usu_id: number;
    usu_nome: string;
    usu_typeUser: number;
}

export interface UserInsertDTO {
    usu_nome: string;
    usu_senha: string;
    usu_typeUser: number;
}

export interface LoginDTO {
    nome: string;
    senha: string;
}

export interface SnapshotProductDTOInsert {
    ContPDFItens_PDF_ID: number;
    snapshot_qtde: number;
    snapshot_comodato: number;
    snapshot_prod_nome: string;
    snapshot_prod_cod: number;
    snapshot_valor_unitario: number;
    snapshot_valor_total_item: number;
    snapshot_prod_cat: number;
}

export interface ProductsCategoriesDTO {
    ID_CategoriaProduto: number;
    CatProd_Nome: string;
    Cat_Prateleira: number;
}

export interface ProductsCategoriesDTOInsert {
    CatProd_Nome: string;
    Cat_Prateleira: number;
}

export interface ProductLaunching {
    ID_Prod: number;
    Prod_CodProduto: string;
    Prod_Estoque: number;
    Prod_CustoCompra: number;
    Prod_Observacao: string;
    Prod_QuantidadeLancada: number;
}

export interface ProductLaunch { 
    ID_LancProd: number;
    LancProd_IDProd: number;
    LancProd_CodProd: string;
    LancProd_QtdeLanc: number;
    LancProd_CustoCompra: number;
    LancProd_Data: string;
    LancProd_OperadorId: number;
    LancProd_OperadorName: string;
    LancProd_Observacao: string;
    LancProd_Tipo: number;
}

export interface ModelosContratoDTO {
    ID_ModeloContrato: number;
    modelCont_Name: string;
    modelCont_Descricao: string;
    modelCont_Date: string;
}

export interface ModelosContratoDTOInsert {
    modelCont_Name: string;
    modelCont_Descricao: string;
    modelCont_Date: string;
}

export interface ModelosContratoItensDTO {
    ID_ModelosContratoItens: number;
    modelContItens_IDModelCont: number;
    modelContItens_IDProd: number;
    modelContItens_Comodato: number;
    modelContItens_PorcLucro: number;
}

export interface ModelosContratoItensDTOInsert {
    modelContItens_IDModelCont: number;
    modelContItens_IDProd: number;
    modelContItens_Comodato: number;
    modelContItens_PorcLucro: number;
}
