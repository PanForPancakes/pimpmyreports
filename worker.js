const discord_webhook_regex = new RegExp("\/https:\/\/discord\.com\/api\/webhooks\/.+", "")

async function handleSimpleRequest(request, path) {
	if (request.method == "GET") {
		if (discord_webhook_regex.test(path)) {
			return new Response("Yes! ✅\nThis link is valid. You can put it into webhook field of your server config.")
		} else {
			return new Response("No. ❌\nThis link is NOT valid. This link WON'T work in webhook field of your server config.")
		}
	} else if (request.method != "POST") {
		return new Response(request.method + " is not allowed.", {
			status: 405,
			statusText: "Method Not Allowed",
			headers: {
				Allow: "GET, POST",
			},
		});
	}

	if (!discord_webhook_regex.test(path)) {
		return new Response("Malformed URL", { status: 400, statusText: "Bad Request" })
	}

	let fetch_data;

	try {
		const info = JSON.parse((await request.text()).substring("payload_json=".length))["embeds"][0]["fields"]

		const reporter_nick = info[3]["value"]
    	const reporter_id = info[2]["value"].replace(/^`+|`+$/g, "")

    	const offender_nick = info[5]["value"]
    	const offender_id = info[4]["value"].replace(/^`+|`+$/g, "")

    	const reason = info[7]["value"]
    	const timestamp = info[9]["value"].replace(" ", "T")

		const new_data = {
			embeds: [
				{
					title: `New report on ${offender_nick}`,
					description: reason,
					color: 0xff3300,
					fields: [
						{
							name: "Info about reporter",
							value: `Nickname: \`${reporter_nick}\`\nUserID: \`${reporter_id}\``,
							inline: true
						},
						{
							name: "Info about offender",
							value: `Nickname: \`${offender_nick}\`\nUserID: \`${offender_id}\``,
							inline: true
						}
					],
					author: { name: `New report from ${reporter_nick}` },
					timestamp: timestamp
				}
			]
		}

		fetch_data = {
			body: JSON.stringify(new_data),
			method: "POST",
			headers: { "content-type": "application/json;charset=UTF-8" }
		}
	} catch (error) {
		fetch_data = request
	} finally {
		return fetch(path.substring(1), fetch_data)
	}
}

async function handleInteractionsRequest(request, path) {
	return new Response("duh")
}

const default_page = "Hello fellow GET'ter!\n\nThis is serverless-microservice or something discord (not affiliated) thing that improves SCP: Secret Laboratory server reports!\n\nFor more info, uhh, currently not a lot of info :("
const url_regex = new RegExp("https?:\\/\\/\\w+\\.\\w+\\.workers\\.dev(\\/.*)", "")

addEventListener("fetch", event => {
	let match = url_regex.exec(event.request.url);
	if (match === null) { throw "regex didn't match" }

	const path = match[1]

	if (path.startsWith("/interactions")) {
		event.respondWith(handleInteractionsRequest(event.request, path.substring("/interactions".length)))
	} else if (path.startsWith("/simple")) {
		event.respondWith(handleSimpleRequest(event.request, path.substring("/simple".length)))
	} else {
		event.respondWith(new Response(default_page))
	}
})