import { Box, TextField, TextFieldProps, Typography, InputAdornment, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FormFieldProps = TextFieldProps & {
  label: string;
  width: string;
  flex: number;
  mr: number;
  mTopTxt?: number;
  content?: string; // Adicionei isso pois estava faltando na tipagem mas sendo usado
};

export const FormField: React.FC<FormFieldProps> = ({ mTopTxt, flex, mr, width, label, name, content, ...rest }) => {
  const fieldId = name || label.toLowerCase().replace(/\s+/g, '-');

  // 1. Estado para controlar se mostra ou não a senha
  const [showPassword, setShowPassword] = useState(false);

  // 2. Verifica se este campo foi declarado como 'password'
  const isPasswordField = rest.type === 'password';

  // 3. Função para alternar o estado
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // 4. Previne que o input perca o foco ao clicar no botão
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box flex={flex} display="flex" justifyContent={content} alignItems="center">
      <Typography component="label" htmlFor={fieldId} width={"25%"} variant="h6">
        {label}:
      </Typography>
      
      <TextField 
        id={fieldId} 
        name={name} 
        variant="outlined" 
        sx={{ width: width }} 
        {...rest} 
        
        // 5. Se for password, alterna dinamicamente o tipo. Se não, usa o tipo original.
        type={isPasswordField ? (showPassword ? 'text' : 'password') : rest.type}
        
        // 6. Injeta o ícone apenas se for password
        InputProps={{
          ...rest.InputProps, // Mantém props antigas se existirem
          endAdornment: isPasswordField ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}