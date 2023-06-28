import http.server, json, requests

class RequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()

        self.wfile.write(b"This is webhook converter (aka \"hello-i-move-jsons\")\n")
        self.wfile.write(b"Converts boring default SCP:SL reports into beautiful ones and POSTs them to endpoint specified URL path\n\n")
        self.wfile.write(b"Usage: \"http://<link to this server>[:port]/https://discord.com/api/webhooks/.../...\" in SCP:SL report webhook field\n\n")
        self.wfile.write(b"(only properly handles report events)")

    def do_POST(self):
        webhook_url = self.path[1:]

        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        info = json.loads(self.data_string.decode()[len("payload_json="):])["embeds"][0]["fields"]

        reporter_nick = info[3]["value"]
        reporter_id = info[2]["value"].strip("`")

        offender_nick = info[5]["value"]
        offender_id = info[4]["value"].strip("`")

        reason = info[7]["value"]
        timestamp = info[9]["value"].replace(" ", "T")

        new_data = {
            "embeds": [
                {
                    "title": f"New report on {offender_nick}",
                    "description": reason,
                    "color": 16724736,
                    "fields": [
                        {
                            "name": "Info about reporter",
                            "value": f"Nickname: `{reporter_nick}`\nUserID: `{reporter_id}`",
                            "inline": True
                        },
                        {
                            "name": "Info about offender",
                            "value": f"Nickname: `{offender_nick}`\nUserID: `{offender_id}`",
                            "inline": True
                        }
                    ],
                    "author": {
                        "name": f"New report from {reporter_nick}"
                    },
                    "timestamp": timestamp
                }
            ],
            "username": "Server reports",
            "avatar_url": "https://em-content.zobj.net/thumbs/72/apple/354/pensive-face_1f614.webp"
        }

        requests.post(webhook_url, json = new_data)

server_address = ("0.0.0.0", 7110) # also it is a good idea to firewall this port or even replace 0.0.0.0 with 127.0.0.1
httpd = http.server.HTTPServer(server_address, RequestHandler)
httpd.serve_forever()
