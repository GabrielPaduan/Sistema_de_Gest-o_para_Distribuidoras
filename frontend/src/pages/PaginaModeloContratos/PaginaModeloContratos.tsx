import React from "react";
import { BoxNavigationModeloContrato, DefaultHeader } from "../../shared/components";
import { TelaGerenciarModelos } from "../../shared/components/TelaGerenciarModelos";

export class PaginaModeloContratos extends React.Component {
    render() {
        return (
            <>
                <DefaultHeader />
                <TelaGerenciarModelos />
            </>
        )
    }
}