using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using SimpleHttp;
using System.Windows.Forms;

namespace MonitorAppBackend
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            Route.Add("/", (req, res, props) =>
            {
                res.AsText("Welcome to the Simple Http Server");
                Application.Run(new Interfata());
            });

            HttpServer.ListenAsync(
                    1337,
                    CancellationToken.None,
                    Route.OnHttpRequestAsync
                )
                .Wait();
        }
    }
}
