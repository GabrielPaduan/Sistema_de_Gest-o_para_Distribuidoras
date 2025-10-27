import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const GenericButton: React.FC<{ name: string, type: "button" | "submit", link: string, onClick?: () => void }> = ({ name, type, link, onClick }) => {
    return (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" type={type} sx={{ margin: 'auto', padding: "15px", width: "100%" }} onClick={onClick} fullWidth>
                <Typography variant="h6" color="text.secondary" sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }}>
                {name}
                </Typography>
            </Button>
        </Link>
    );
}