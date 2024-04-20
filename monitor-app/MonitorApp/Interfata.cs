using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MonitorAppBackend
{
    public partial class Interfata : Form
    {
        public bool timeStarted = true;
        public Interfata(MonitorRequest data)
        {
            InitializeComponent();
            this.title.Text = data.activity;

            showTimer(data.time);
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

        private void button1_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}
