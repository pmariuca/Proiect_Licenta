using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;

namespace MonitorAppBackend
{
    public partial class Interfata : Form
    {
        StorageClient storage;
        MonitorRequest monitorRequest;

        public bool timeStarted = true;
        public Interfata(MonitorRequest data, StorageClient storage)
        {
            InitializeComponent();
            this.monitorRequest = data;
            this.storage = storage;

            this.title.Text = data.activity;
            showTimer(data.time);
            takeScreenshot();
        }

        public void showTimer(string seconds)
        {
            int secondsNr = int.Parse(seconds);

            Timer timer = new Timer();
            timer.Interval = 1000;

            timer.Tick += (sender, e) =>
            {
                secondsNr--;
                if (secondsNr >= 0)
                {
                    int minutes = secondsNr / 60;
                    int totalSeconds = secondsNr % 60;

                    timeLeft.Text = $"Timp rămas: {minutes}:{totalSeconds}";
                }
                else
                {
                    timer.Stop();
                    Close();
                }
            };

            timer.Start();
        }

        public void takeScreenshot()
        {
            Console.WriteLine("in screenshot");
            int interval = int.Parse(monitorRequest.time) < 100 ? int.Parse(monitorRequest.time) / 10 : int.Parse(monitorRequest.time) / 15;
            int totalSeconds = int.Parse(monitorRequest.time);
            var bucketName = "screenshots-d1cba.appspot.com";

            int nr = 1;

            Timer timer = new Timer();
            timer.Interval = interval * 1000;

            timer.Tick += (sender, e) => {
                totalSeconds -= interval;
                Console.WriteLine(totalSeconds);

                if (totalSeconds >= 0)
                {
                    using (Bitmap screenshot = new Bitmap(Screen.PrimaryScreen.Bounds.Width,
                                           Screen.PrimaryScreen.Bounds.Height,
                                           PixelFormat.Format32bppArgb))
                    {
                        using (Graphics gfxScreenshot = Graphics.FromImage(screenshot))
                        {
                            gfxScreenshot.CopyFromScreen(Screen.PrimaryScreen.Bounds.X,
                                                         Screen.PrimaryScreen.Bounds.Y,
                                                         0, 0,
                                                         Screen.PrimaryScreen.Bounds.Size,
                                                         CopyPixelOperation.SourceCopy);
                        }

                        // Salvarea capturii de ecran într-un MemoryStream
                        using (var stream = new MemoryStream())
                        {
                            screenshot.Save(stream, ImageFormat.Png);
                            stream.Position = 0;

                            var objectName = $"{monitorRequest.activityID}/{monitorRequest.username}/{nr}.png";
                            Console.WriteLine(objectName);
                            storage.UploadObject(bucketName, objectName, null, stream);

                            nr++;
                        }
                    }
                }
                else
                {
                    timer.Stop();
                }
            };

            timer.Start();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}
