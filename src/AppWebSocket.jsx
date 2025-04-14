import { useEffect } from "react";
import { useApp, queryClient } from "./ThemedApp";
import useWebSocket, { ReadyState } from "react-use-websocket";
export default function AppSocket() {
  const { auth } = useApp();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    import.meta.env.VITE_WS,
    {
      shouldReconnect: () => true, // 👈 auto-reconnect
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );
  
  useEffect(() => {
    if (auth && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        token: localStorage.getItem("token"),
      });
    }
  }, [readyState, auth, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.event) {
      queryClient.invalidateQueries(["notis", lastJsonMessage.event]);
    }
  }, [lastJsonMessage]);
  return <></>;
}
