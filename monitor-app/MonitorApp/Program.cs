using System;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Text.Json;
using System.IO;
using System.Net;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using System.Linq;
using System.Management;
using System.Collections.Generic;

namespace MonitorAppBackend
{
    internal class Program
    {
        static void Main(string[] args)
        {
            StorageClient storageClient = null;

            string jsonPath = @"D:\Learning\Proiect_Licenta\monitor-app\screenshots-d1cba-firebase-adminsdk-n49a5-829e49782c.json";
            using (var jsonKeyStream = new FileStream(jsonPath, FileMode.Open, FileAccess.Read))
            {
                var credential = GoogleCredential.FromStream(jsonKeyStream);

                storageClient = StorageClient.Create(credential);
            }

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
                        Application.Run(new Interfata(data, storageClient));
                    });


                    byte[] buffer = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { message = "Monitor started." }));
                    response.ContentLength64 = buffer.Length;
                    response.ContentType = "application/json";
                    using (var responseOutput = response.OutputStream)
                    {
                        responseOutput.Write(buffer, 0, buffer.Length);
                    }
                }

                if (request.Url.AbsolutePath == "/stopMonitor" && request.HttpMethod == "POST")
                {
                    string requestBody;
                    using (var reader = new StreamReader(request.InputStream, request.ContentEncoding))
                    {
                        requestBody = reader.ReadToEnd();
                    }

                    var formToClose = Application.OpenForms.OfType<Interfata>().FirstOrDefault();
                    Task.Run(() =>
                    {
                        if (formToClose != null)
                        {
                            if (formToClose.InvokeRequired)
                            {
                                formToClose.Invoke((MethodInvoker)delegate
                                {
                                    formToClose.Close();
                                });
                            }
                            else
                            {
                                formToClose.Close();
                            }
                        }
                    });


                    byte[] buffer = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { message = "Monitor stopped." }));
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
