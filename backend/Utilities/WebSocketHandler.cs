using System.Net.WebSockets;
using System.Text;

namespace backend.Utilities;

public class WebSocketHandler
{
    private static Dictionary<int, WebSocket> _sockets = new Dictionary<int, WebSocket>();

    public async Task HandleWebSocket(WebSocket webSocket, int userId)
    {
        _sockets[userId] = webSocket;

        await SendMessage(userId, $"userId: {userId}");

        while (webSocket.State == WebSocketState.Open)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                _sockets.Remove(userId);
            }
        }
    }
}
