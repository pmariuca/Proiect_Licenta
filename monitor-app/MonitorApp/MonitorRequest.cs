using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.TaskbarClock;

namespace MonitorAppBackend
{
    public class MonitorRequest
    {
        public string username { get; set; }
        public string time { get; set; }
        public string activity { get; set; }

        public void modifyTime()
        {
            this.time = (int.Parse(this.time) * 60).ToString();
        }

        public override string ToString()
        {
            return $"Username: {username}, Time: {time}, Activity: {activity}";
        }
    }
}
