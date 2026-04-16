import { useEffect, useCallback, useState } from "react";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { performLogout } from "../service/authService.js";

export default function useIdleTimer(timeoutInMinutes = 60) {
    const { token } = useUserStore();
    const navigate = useNavigate();
    const handleLogout = useCallback(async () => {
        const currentToken = useUserStore.getState().token;
        if (!currentToken) return;
        await performLogout(navigate, "/login?reason=expired")
    }, [navigate]);

    useEffect(() => {
        if (!token) return;

        let timer;

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(handleLogout, timeoutInMinutes * 60 * 1000);
        };

        const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
            if (timer) clearTimeout(timer);
        };
    }, [token, handleLogout, timeoutInMinutes]);
}