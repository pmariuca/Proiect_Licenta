using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using SimpleHttp;
using System.Windows.Forms;
using System.Text.Json;
using System.IO;
using System.Net;

namespace MonitorAppBackend
{
    internal class Program
    {
        static void Main(string[] args)
        {
            HttpListener listener = new HttpListener();
            listener.Prefixes.Add("http://localhost:8080/");
            listener.Start();
            Console.WriteLine("Listening...");

            while (true)
            {
                HttpListenerContext context = listener.GetContext();
                HttpListenerRequest request = context.Request;
                HttpListenerResponse response = context.Response;

                response.AppendHeader("Access-Control-Allow-Origin", "*");
                response.AppendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                response.AppendHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

                if (request.HttpMethod == "OPTIONS")
                {
                    response.StatusCode = 204;
                    response.AddHeader("Access-Control-Max-Age", "3600");
                    response.Close();
                    continue;
                }

                if (request.Url.AbsolutePath == "/startMonitor" && request.HttpMethod == "POST")
                {
                    string requestBody;
                    using (var reader = new StreamReader(request.InputStream, request.ContentEncoding))
                    {
                        requestBody = reader.ReadToEnd();
                    }

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    var data = JsonSerializer.Deserialize<MonitorRequest>(requestBody, options);
                    data.modifyTime();

                    Console.WriteLine(data.ToString());

                    Task.Run(() =>
                    {
                        Application.Run(new Interfata(data));
                    });


                    byte[] buffer = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { message = "Monitor started" }));
                    response.ContentLength64 = buffer.Length;
                    response.ContentType = "application/json";
                    using (var responseOutput = response.OutputStream)
                    {
                        responseOutput.Write(buffer, 0, buffer.Length);
                    }
                }

                response.StatusCode = (int)HttpStatusCode.OK;
                response.Close();
            }
        }
    }
}
