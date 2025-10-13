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
    cli_modelo: number;
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
    cli_modelo: number;
}

export interface ProductDTO {
    ID_Prod: number;
    Prod_Valor: number;
    Prod_CustoCompra: number;
    Prod_CFOP: string;
    Prod_NCM: number;
    Prod_UnMedida: string;
    Prod_CodProduto: string;
    Prod_CodBarras: number;
    Prod_Nome: string;
    Prod_Estoque: number;
}

export interface ProductDTOInsert {
    Prod_Valor: number;
    Prod_CustoCompra: number;
    Prod_CFOP: string;
    Prod_NCM: number;
    Prod_UnMedida: string;
    Prod_CodProduto: string;
    Prod_CodBarras: number;
    Prod_Nome: string;
    Prod_Estoque: number;
}

export interface ContractDTO {
    ID_Contrato: number;
    Cont_ID_Cli: number;
    Cont_ID_Prod: number;
    Cont_Comodato: number;
    Cont_Qtde: number;
    Cont_ValorTotal: number;
}

export interface ContractDTOInsert {
    Cont_ID_Cli: number;
    Cont_ID_Prod: number;
    Cont_Comodato: number;
    Cont_Qtde: number;
    Cont_ValorTotal: number;
}

export interface TableContractProps {
    client: ClientDTO | null;
    contracts: ContractDTO[];
    products: ProductDTO[];
}
export interface LayoutBaseContratoProps {
    id: number;
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

export interface LoginResponse {
  token: string;
}

export interface PdfStructDTO {
    id: number;
    PDF_Client_Id: number;
    PDF_Status: number;
    PDF_Generated_Date: string;
    PDF_Observacoes: string;
}

export interface PdfStructInsertDTO {
    PDF_Client_Id: number;
    PDF_Status: number;
    PDF_Generated_Date: string;
    PDF_Observacoes: string;
}

export interface PdfStructCompleteDTO {
    id: number;    
    PDF_Status: number;
    PDF_Generated_Date: string;
    PDF_Client: ClientDTO | null;
    PDF_Contracts: ContractDTO[];
    PDF_Products: ProductDTO[];
    PDF_Observacoes: string;
}

export interface DadosProdutoComodatoDTO {
    qtde: number;
    valorTotal: number
}
