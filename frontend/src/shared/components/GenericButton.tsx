import { Button, Typography } from "@mui/material";

export const GenericButton: React.FC<{ name: string, type: "button" | "submit", onClick?: () => void }> = ({ name, type, onClick }) => {
    return (
        <Button variant="contained" color="primary" type={type} sx={{ margin: 'auto', padding: "15px", width: "100%" }} onClick={onClick} fullWidth>
            <Typography variant="h6" fontSize={'14px'} color="text.secondary" sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }}>
            {name}
            </Typography>
        </Button>
    );
}