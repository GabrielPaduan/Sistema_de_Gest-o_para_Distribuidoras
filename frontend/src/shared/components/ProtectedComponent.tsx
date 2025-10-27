import { useAuth } from "../context"

export const ProtectedComponent: React.FC<{ allowedRoles?: string[], children: React.ReactNode }> = ({ allowedRoles = [], children }) => {
    const { user } = useAuth();

    if (!user) return null;

    if (user && allowedRoles.includes(user.role.toString())) {
        return <>{children}</>;
    } else {
        return null;
    }
}