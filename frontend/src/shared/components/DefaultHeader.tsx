import { Box, Button, Collapse, Icon, Typography } from "@mui/material";
import React from "react";
import { useAuth } from "../context";

export const DefaultHeader: React.FC = () => {
  const [openMenuLogin, setOpenMenuLogin] = React.useState(false);
  const { user } = useAuth();
  const { logout } = useAuth();
  const handleMenuLogin = () => {
    if (openMenuLogin){
      setOpenMenuLogin(false);
    } else {
      setOpenMenuLogin(true);
    }
  }

  

  const handleLogout = () => {
    logout();
  }

   return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} paddingTop={2} paddingRight={10} paddingBottom={2} paddingLeft={10} bgcolor={'background.default'} color={'white'} sx={{ '@media ( min-width: 320px) and (max-width: 800px)': { padding: 0.5 } }} >
        <Box padding={1} >
            <Box component={'img'} src={'/logo_empresa.png'} alt={'Logo da Empresa'} sx={{minWidth: 50, minHeight: 50, maxWidth: 125, maxHeight: 125, borderRadius: '100%', 
            '@media (min-width: 320px) and (max-width: 800px)': {
              width: '80px',
              height: '80px',
            }
            }} />
        </Box>

        <Box padding={1} 
            sx={{ backgroundColor: 'background.paper', borderRadius: "50%", cursor: 'pointer', ":hover": { boxShadow: 3 }, transition: 'all 1s ease', ...(openMenuLogin && {
              borderTopLeftRadius: "5%", borderTopRightRadius: "5%", borderBottomLeftRadius: "5%", borderBottomRightRadius: "5%", boxShadow: 3
            }), '@media (max-width: 800px)': { padding: 0.5, gap: 0 } }} 
            onClick={handleMenuLogin}
            display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} flexDirection={"column"}
            >
              <Box display={"flex"} justifyContent={"center"} alignItems={"center"}  flexDirection={"column"} padding={1}>
                <Icon sx={{ fontSize: 70, color: 'text.primary', '@media (max-width: 800px)': { padding: "0px", fontSize: "50px" } }}>person</Icon>
                <Typography variant="body2" color="text.primary" sx={{ '@media ( min-width: 320px) and (max-width: 800px)': { display: 'none' } }}>
                    Olá, {user?.name}!
                </Typography>
              </Box>
              <Collapse in={openMenuLogin} timeout={900} sx={{ width: '100%', '@media ( min-width: 320px) and (max-width: 800px)': { width: '80%' } }}>
                <Box display="flex" justifyContent="center" >
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ padding: '5px', '@media ( min-width: 320px) and (max-width: 800px)': { paddingRight: 1 } }}
                    onClick={handleLogout} 
                  >
                    <Typography color="text.secondary" sx={{ '@media ( min-width: 320px) and (max-width: 800px)': { fontSize: '0.8rem', paddingRight: 0 } }}>
                      SAIR
                    </Typography>
                  </Button>
                </Box>
              </Collapse>
          
        </Box>
      </Box>
  );
}