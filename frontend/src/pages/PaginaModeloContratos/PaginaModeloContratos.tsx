import React from "react";
import { BoxNavigationModeloContrato, DefaultHeader } from "../../shared/components";

export class PaginaModeloContratos extends React.Component {
    render() {
        return (
            <>
                <DefaultHeader />
                <BoxNavigationModeloContrato />
            </>
        )
    }
}