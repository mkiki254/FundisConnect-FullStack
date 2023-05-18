import { useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Protected({ component: Component }) {
    const { isLoggedIn, userPermit } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/signup");
        } else if (isLoggedIn && (userPermit == "is_artisan")) {
            navigate("/artisan-home")
        } else if (isLoggedIn && (userPermit == "is_customer")) {
            navigate("/customer-home")
        } else if (isLoggedIn && (userPermit == "is_admin")) {
            navigate("/admin-home")
        }
    }, [isLoggedIn, userPermit]);

    if (!isLoggedIn) return null;

    return <Component/>
}