using System.Net.WebSockets;
using System.Text;

namespace backend.Utilities;

public class WebSocketHandler
{
    private static Dictionary<int, WebSocket> _sockets = new Dictionary<int, WebSocket>();

}