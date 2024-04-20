namespace MonitorAppBackend
{
    partial class Interfata
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.title = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.timeLeft = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // title
            // 
            this.title.AutoSize = true;
            this.title.Font = new System.Drawing.Font("Times New Roman", 16.2F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.title.Location = new System.Drawing.Point(32, 44);
            this.title.Name = "title";
            this.title.Size = new System.Drawing.Size(108, 32);
            this.title.TabIndex = 0;
            this.title.Text = "Activity";
            this.title.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // button1
            // 
            this.button1.BackColor = System.Drawing.Color.Plum;
            this.button1.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.button1.ForeColor = System.Drawing.Color.Black;
            this.button1.Location = new System.Drawing.Point(119, 196);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(143, 50);
            this.button1.TabIndex = 1;
            this.button1.Text = "Stop timer";
            this.button1.UseVisualStyleBackColor = false;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // timeLeft
            // 
            this.timeLeft.AutoSize = true;
            this.timeLeft.Font = new System.Drawing.Font("Times New Roman", 13.8F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.timeLeft.Location = new System.Drawing.Point(33, 93);
            this.timeLeft.Name = "timeLeft";
            this.timeLeft.Size = new System.Drawing.Size(132, 26);
            this.timeLeft.TabIndex = 2;
            this.timeLeft.Text = "Timp rămas:";
            // 
            // Interfata
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Thistle;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Center;
            this.ClientSize = new System.Drawing.Size(395, 273);
            this.Controls.Add(this.timeLeft);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.title);
            this.ForeColor = System.Drawing.Color.Black;
            this.Name = "Interfata";
            this.Text = "Interfata";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label title;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Label timeLeft;
    }
}