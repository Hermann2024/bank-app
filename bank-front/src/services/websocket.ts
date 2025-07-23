// Service WebSocket natif pour notifications en temps réel
let socket: WebSocket | null = null;
let listeners: ((msg: any) => void)[] = [];

export function connectWebSocket(url: string) {
  if (socket) return;
  socket = new WebSocket(url);
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach(fn => fn(data));
    } catch (e) {
      // ignore
    }
  };
  socket.onclose = () => {
    socket = null;
    // Optionnel: reconnexion automatique
    setTimeout(() => connectWebSocket(url), 5000);
  };
}

export function subscribeToNotifications(fn: (msg: any) => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
} 