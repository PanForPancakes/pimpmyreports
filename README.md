# pimpmyreports
Simple microservice to make SCP: Secret Laboratory webhook server reports a little bit better

# what gives
![don't you think it looks much better?](whatgives.png)

# but why though?
well someone said that this is just, you know, \*impossible\*, since you can't really adjust webhook json via server configs, as it is hardcoded inside the game

oh and also it looks much better in my opinion

---

*generally this project is just a PoC*  
*I mean, it might/should work just fine in proper enviroment, but you know, THIS SOFTWARE IS PROVIDED "AS IS"*

---

# ok you got me where i can get such a cool thing

remember discord webhook links you insert into your server config? just append this link before your webhook:
```
https://pimpmyreports.vsh.workers.dev/simple/
```
it should start to look something like this:
```
https://pimpmyreports.vsh.workers.dev/simple/https://discord.com/api/webhooks/xxxxxx/yyyyyyy
```

and you're all set (or not in case that worker is dead for some reason and i didn't tell you, anyway)