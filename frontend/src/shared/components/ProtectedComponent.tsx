import { useAuth } from "../context"

export const ProtectedComponent: React.FC<{ allowedRoles?: string[], children: React.ReactNode }> = ({ allowedRoles = [], children }) => {
    const { user } = useAuth();

    if (!user) return null;
    
    console.log(user?.role);
    console.log(allowedRoles.includes(user?.role.toString()));

    if (user && allowedRoles.includes(user.role.toString())) {
        return <>{children}</>;
    } else {
        return null;
    }
}