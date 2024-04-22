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
using System.Management;
using System.Diagnostics;
using System.Collections;

namespace MonitorAppBackend
{
    public partial class Interfata : Form
    {
        private StorageClient storage;
        private MonitorRequest monitorRequest;
        private ManagementEventWatcher watcher;

        private List<string> openedProcesses = new List<string>();
        public bool timeStarted = true;

        public Interfata(MonitorRequest data, StorageClient storage)
        {
            InitializeComponent();
            this.monitorRequest = data;
            this.storage = storage;

            this.title.Text = data.activity;
            showTimer(data.time);
            takeScreenshot();
            StartMonitoring();
        }

        private void showTimer(string seconds)
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

        private void takeScreenshot()
        {
            int interval = int.Parse(monitorRequest.time) < 100 ? int.Parse(monitorRequest.time) / 10 : int.Parse(monitorRequest.time) / 15;
            int totalSeconds = int.Parse(monitorRequest.time);
            var bucketName = "screenshots-d1cba.appspot.com";

            int nr = 1;

            Timer timer = new Timer();
            timer.Interval = interval * 1000;

            timer.Tick += (sender, e) => {
                totalSeconds -= interval;

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

                        using (var stream = new MemoryStream())
                        {
                            screenshot.Save(stream, ImageFormat.Png);
                            stream.Position = 0;

                            var objectName = $"{monitorRequest.activityID}/{monitorRequest.username}/{nr}.png";
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

        public void StartMonitoring()
        {
            Task.Run(() => GetExistingProcesses());

            string queryString = "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE TargetInstance ISA 'Win32_Process'";

            watcher = new ManagementEventWatcher(new WqlEventQuery(queryString));
            watcher.EventArrived += new EventArrivedEventHandler(HandleEvent);

            watcher.Start();
        }

        private void GetExistingProcesses()
        {
            ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Process");

            foreach (ManagementObject obj in searcher.Get())
            {
                string processName = obj["Name"].ToString();
                string processId = obj["ProcessId"].ToString();
                ManagementObject process = new ManagementObject($"Win32_Process.Handle='{processId}'");

                ManagementBaseObject outParams = process.InvokeMethod("GetOwner", null, null);
                if (outParams != null && outParams["User"] != null)
                {
                    string user = (string)outParams["User"];
                    if (user.Equals("mariu", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!openedProcesses.Contains(processName))
                        {
                            openedProcesses.Add(processName);
                        }
                    }
                }
            }
        }

        private void HandleEvent(object sender, EventArrivedEventArgs e)
        {
            ManagementBaseObject newEvent = e.NewEvent["TargetInstance"] as ManagementBaseObject;
            if (newEvent != null)
            {

                string processId = newEvent["ProcessId"].ToString();
                string processPath = $"Win32_Process.Handle='{processId}'";
                ManagementObject process = new ManagementObject(processPath);

                ManagementBaseObject outParams = process.InvokeMethod("GetOwner", null, null);
                if (outParams != null)
                {
                    string user = (string)outParams["User"];
                    string domain = (string)outParams["Domain"];

                    if (user.Equals("mariu", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!openedProcesses.Contains((string)newEvent["Name"]))
                        {
                            openedProcesses.Add((string)newEvent["Name"]);
                        }
                    }
                }
            }
        }


        private void button1_Click(object sender, EventArgs e)
        {
            Close();
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            base.OnFormClosing(e);
            foreach(string s in openedProcesses)
            {
                Console.WriteLine(s);
            }
            if (watcher != null)
            {
                watcher.Stop();
                watcher.Dispose();
            }
        }
    }
}
