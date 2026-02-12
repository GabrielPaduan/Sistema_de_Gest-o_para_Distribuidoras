import React from "react";
import { DefaultHeader, LayoutModelContract } from "../../shared/components";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

export const ContratoModelo: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <DefaultHeader />
            <Box textAlign={"center"}>
                <LayoutModelContract id={Number(id)} />
            </Box>            
        </>
    )
}