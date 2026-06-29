import json
import paramiko
import threading
from decouple import config
from channels.generic.websocket import WebsocketConsumer

class TerminalConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        
        # 1. Setup the SSH client to talk to your Judge0 VM
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        try:
            # USE YOUR VM'S IP HERE
            self.ssh.connect(
              hostname=config('VM_IP'),
                username=config('VM_USER'),
                password=config('VM_PASS'),
                port=22,
                timeout=10
            )

            # 2. Open an interactive session
            self.channel = self.ssh.get_transport().open_session()
            self.channel.get_pty() # This makes it look like a real terminal
            self.channel.invoke_shell()

            # 3. Read from Ubuntu, send to React
            def stream_output():
                while True:
                    if self.channel.recv_ready():
                        # Read the raw bytes and send them as text
                        data = self.channel.recv(1024).decode('utf-8', errors='replace')
                        self.send(text_data=data)

            threading.Thread(target=stream_output, daemon=True).start()

        except Exception as e:
            self.send(text_data=f"\r\n\x1b[31mError connecting to VM: {str(e)}\x1b[0m\r\n")

    def receive(self, text_data):
        # 4. When the student types in React, send it to the VM
        if hasattr(self, 'channel'):
            self.channel.send(text_data)

    def disconnect(self, close_code):
        if hasattr(self, 'ssh'):
            self.ssh.close()