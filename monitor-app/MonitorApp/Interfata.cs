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

namespace MonitorAppBackend
{
    public partial class Interfata : Form
    {
        private StorageClient storage;
        private MonitorRequest monitorRequest;
        private ManagementEventWatcher watcher;

        private System.Threading.Timer timer;

        private List<string> openedProcesses = new List<string>();
        public bool timeStarted = true;

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

            this.title.Text = data.activity;
            showTimer(data.time);
            takeScreenshot();
            StartMonitoring();

            EnumWindowsProc enumProc = new EnumWindowsProc(EnumTheWindows);
            EnumWindows(enumProc, IntPtr.Zero);

            // Configurați temporizatorul separat pentru a apela EnumTheWindows la fiecare 5 secunde
            TimerCallback callback = new TimerCallback(EnumTheWindowsCallback);
            timer = new System.Threading.Timer(callback, null, TimeSpan.Zero, TimeSpan.FromSeconds(15));
        }

        static bool EnumTheWindows(IntPtr hWnd, IntPtr lParam)
        {
            const int nChars = 256;
            StringBuilder Buff = new StringBuilder(nChars);

            if (IsWindowVisible(hWnd))
            {
                if (GetWindowText(hWnd, Buff, nChars) > 0)
                {
                    Console.WriteLine($"Window Handle: {hWnd}, Title: {Buff}");
                }
            }
            return true; // Indică să continue enumerarea
        }

        private void EnumTheWindowsCallback(object state)
        {
            // Enumeră ferestrele existente
            EnumWindowsProc enumProc = new EnumWindowsProc(EnumTheWindows);
            EnumWindows(enumProc, IntPtr.Zero);

            // Adaugă apelul către noua funcție pentru enumerarea ferestrelor Visual Studio
            EnumIDEWindows(); // Aceasta este noua funcție adăugată
        }

        private void EnumIDEWindows()
        {
            Process[] procsEdge = Process.GetProcessesByName("devenv");
            if (procsEdge.Length <= 0)
            {
                Console.WriteLine("Edge is not running");
            }
            else
            {
                foreach (Process proc in procsEdge)
                {
                    //the Edge process must have a window
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
                                Console.WriteLine("TABNAME: " + tabitem.Current.Name);
                            }

                        }
                    }
                }
            }
        }

        private void showTimer(string seconds)
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

            System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer();
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

            if (timer != null)
            {
                timer.Change(Timeout.Infinite, Timeout.Infinite);
                timer.Dispose();
            }

            watcher?.Stop();
            watcher?.Dispose();

            foreach (string s in openedProcesses)
            {
                Console.WriteLine(s);
            }
        }
    }
}
