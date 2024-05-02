using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;
using Google.Cloud.Storage.V1;
using System.Management;
using System.Diagnostics;
using System.Windows.Automation;
using System.Text;
using System.Runtime.InteropServices;
using System.Threading;
using System.Net.Http;
using System.Text.Json;

namespace MonitorAppBackend
{
    public partial class Interfata : Form
    {
        private StorageClient storage;
        private MonitorRequest monitorRequest;
        private ManagementEventWatcher watcher;

        private static readonly HttpClient client = new HttpClient();

        private System.Threading.Timer timer;
        public bool timeStarted = true;

        private List<string> openedProcesses = new List<string>();
        private List<string> openedTabs = new List<string>();
        private List<string> openedFiles = new List<string>();

        private HashSet<string> monitoredExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            ".doc", ".docx", ".pdf", ".txt", ".rtf",
            ".xls", ".xlsx", ".ppt", ".pptx",
            ".odt", ".ods", ".odp",
            ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".tiff",
            ".mp3", ".wav", ".mp4", ".avi", ".mov", ".wmv",
            ".js", ".html", ".htm", ".css", ".py", ".java", ".c", ".cpp", ".cs", ".sh",
            ".zip", ".rar", ".7z", ".iso", ".dll", ".exe", "- Excel"
        };

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        [DllImport("user32.dll", SetLastError = true)]
        static extern bool EnumWindows(EnumWindowsProc enumFunc, IntPtr lParam);

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]

        static extern bool IsWindowVisible(IntPtr hWnd);

        delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        public Interfata(MonitorRequest data, StorageClient storage)
        {
            InitializeComponent();
            this.monitorRequest = data;
            this.storage = storage;

            this.label1.Text = data.activity;
            ShowTimer(data.time);

            TakeScreenshot();
            CollectExistingProcess();
            StartMonitoring();
        }

        bool EnumTheWindows(IntPtr hWnd, IntPtr lParam)
        {
            const int nChars = 256;
            StringBuilder Buff = new StringBuilder(nChars);

            if (IsWindowVisible(hWnd))
            {
                if (GetWindowText(hWnd, Buff, nChars) > 0)
                {
                    string title = Buff.ToString();
                    Console.WriteLine($"Window Handle: {hWnd}, Title: {Buff}");

                    if(title.Contains("Edge") || title.Contains("Google"))
                    {
                        if(!openedTabs.Contains(title))
                        {
                            openedTabs.Add(title);
                        }
                    }
                    else
                    {
                        foreach (var extension in monitoredExtensions)
                        {
                            if (title.Contains(extension))
                            {
                                if (!openedFiles.Contains(title))
                                {
                                    openedFiles.Add(title);
                                    Console.WriteLine("Monitored file type detected: " + title);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }

        private void EnumTheWindowsCallback(object state)
        {
            EnumWindowsProc enumProc = new EnumWindowsProc(EnumTheWindows);
            EnumWindows(enumProc, IntPtr.Zero);

            EnumIDEWindows();
        }

        private void EnumIDEWindows()
        {
            Process[] procsVisual = Process.GetProcessesByName("devenv");
            if (procsVisual.Length <= 0)
            {
                Console.WriteLine("Visual Studio is not running.");
            }
            else
            {
                foreach (Process proc in procsVisual)
                {
                    if (proc.MainWindowHandle != IntPtr.Zero)
                    {
                        AutomationElement root = AutomationElement.FromHandle(proc.MainWindowHandle);
                        TreeWalker treewalker = TreeWalker.ControlViewWalker;
                        AutomationElement rootParent = treewalker.GetParent(root);
                        Condition condWindow = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Window);
                        AutomationElementCollection edges = rootParent.FindAll(TreeScope.Children, condWindow);
                        Condition condNewTab = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.TabItem);
                        foreach (AutomationElement e in edges)
                        {

                            foreach (AutomationElement tabitem in e.FindAll(TreeScope.Descendants, condNewTab))
                            {
                                string title = tabitem.Current.Name;
                                if(title.Contains(".") && !openedFiles.Contains(title))
                                {
                                    openedFiles.Add(title);
                                } 
                                Console.WriteLine("TABNAME: " + tabitem.Current.Name);
                            }

                        }
                    }
                }
            }
        }

        private void ShowTimer(string seconds)
        {
            int secondsNr = int.Parse(seconds);

            System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer();
            timer.Interval = 1000;

            timer.Tick += (sender, e) =>
            {
                secondsNr--;
                if (secondsNr >= 0)
                {
                    int minutes = secondsNr / 60;
                    int totalSeconds = secondsNr % 60;

                    if(totalSeconds < 10)
                    {
                        timeLeft.Text = $"Timp rămas: {minutes}:0{totalSeconds}";
                    }
                    else
                    {
                        timeLeft.Text = $"Timp rămas: {minutes}:{totalSeconds}";
                    }
                }
                else
                {
                    timer.Stop();
                    Close();
                }
            };

            timer.Start();
        }

        private void TakeScreenshot()
        {
            int interval = int.Parse(monitorRequest.time) < 100 ? int.Parse(monitorRequest.time) / 10 : int.Parse(monitorRequest.time) / 15;
            int totalSeconds = int.Parse(monitorRequest.time);
            var bucketName = "screenshots-d1cba.appspot.com";

            int nr = 1;
            Size size = new Size(1920, 1080);

            System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer();
            timer.Interval = interval * 1000;

            timer.Tick += (sender, e) => {
                totalSeconds -= interval;

                if (totalSeconds >= 0)
                {
                    using (Bitmap screenshot = new Bitmap(1920,
                                           1080,
                                           PixelFormat.Format32bppArgb))
                    {
                        using (Graphics gfxScreenshot = Graphics.FromImage(screenshot))
                        {
                            gfxScreenshot.CopyFromScreen(Screen.PrimaryScreen.Bounds.X,
                                                         Screen.PrimaryScreen.Bounds.Y,
                                                         0, 0, size,
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

        public async void CollectExistingProcess()
        {
            await Task.Run(() => GetExistingProcesses());
        }

        public void StartMonitoring()
        {
            string queryString = "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE TargetInstance ISA 'Win32_Process'";

            watcher = new ManagementEventWatcher(new WqlEventQuery(queryString));
            watcher.EventArrived += new EventArrivedEventHandler(HandleEvent);

            watcher.Start();

            EnumWindowsProc enumProc = new EnumWindowsProc(EnumTheWindows);
            EnumWindows(enumProc, IntPtr.Zero);

            TimerCallback callback = new TimerCallback(EnumTheWindowsCallback);
            timer = new System.Threading.Timer(callback, null, TimeSpan.Zero, TimeSpan.FromSeconds(10));
        }

        private void GetExistingProcesses()
        {
            ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Process");

            foreach (ManagementObject obj in searcher.Get())
            {
                try
                {
                    string processName = obj["Name"].ToString();
                    string processId = obj["ProcessId"].ToString();
                    ManagementObject process = new ManagementObject($"Win32_Process.Handle='{processId}'");

                    try
                    {
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
                    catch (ManagementException ex)
                    {
                        if (ex.ErrorCode == ManagementStatus.NotFound)
                        {
                            Console.WriteLine($"Process with ID {processId} no longer exists.");
                        }
                        else
                        {
                            throw;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while processing process ID {obj["ProcessId"]}: {ex.Message}");
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


        private async void button1_Click(object sender, EventArgs e)
        {
            await StopTestAsync();
            Close();
        }

        private async Task SendDataAsync()
        {
            try
            {
                var payload = new
                {
                    username = monitorRequest.username,
                    activityID = monitorRequest.activityID,
                    OpenedProcesses = openedProcesses,
                    OpenedTabs = openedTabs,
                    OpenedFiles = openedFiles
                };
                string jsonPayload = JsonSerializer.Serialize(payload);

                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://localhost:3001/questions/monitorData", content);
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Data sent successfully.");
                }
                else
                {
                    Console.WriteLine("Failed to send data.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in sending data: " + ex.Message);
            }
        }

        private async Task StopTestAsync()
        {
            try
            {
                var payload = JsonSerializer.Serialize(new { message = "Stop test." });
                var content = new StringContent(payload, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://localhost:3001/questions/stopTest", content);
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Test stopped successfully.");
                }
                else
                {
                    Console.WriteLine("Failed to stop the test.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in sending stop test request: " + ex.Message);
            }
        }

        protected override async void OnFormClosing(FormClosingEventArgs e)
        {
            base.OnFormClosing(e);

            if (timer != null)
            {
                timer.Change(Timeout.Infinite, Timeout.Infinite);
                timer.Dispose();
            }

            watcher?.Stop();
            watcher?.Dispose();

            await SendDataAsync();

            Console.WriteLine("opened processes");
            foreach (string s in openedProcesses)
            {
                Console.WriteLine(s);
            }

            Console.WriteLine("opened tabs");
            foreach (string s in openedTabs)
            {
                Console.WriteLine(s);
            }
            Console.WriteLine("opened files");
            foreach (string s in openedFiles)
            {
                Console.WriteLine(s);
            }
        }
    }
}
