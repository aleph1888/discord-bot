NOTICE: DON'T MAKE THIS REPO PUBLIC UNTIL YOU MANAGE:

- Discord token at package.json/token field.  
- Folder "ec2" with aws instance credentials and jenkins access.  

discord-bot Bot
==========
This is a discord bot. Use [botOntology.json](botOntology.json) to manage text (static) responses. Use [UserActions.ts](src/Discord/UserActions.ts) to add dynamic logic.


Ubuntu bot installation
-----------------
Code is managed by pm2.

Autoupdate is managed by jenkins & githubweb hooks.

### Jenkins folder

Use link ./jenkins-folder that drives to: "/var/lib/jenkins/workspace/discord-bot". 

### Run bot
To start the process we locate at "Jenkins folder" and from there run script "runbot.sh" which starts with the pm2 process.

NOTICE: Machine (aws free tier) cannot handle compiling nodejs code so it must be already builded.

### Jenkins machine

Jenkins is running at port 8080. See user & password at ec2 folder.

There is a job called: http://ip:8080/job/discord-bot/

This job only listens to https://github.com/repo-url/settings/hooks/273947063 webhook.

Every push action on the github repo will trigger the webhook. Jenkins will pull the content to folder. And pm2 has "--watch" enabled so is responsible to restart the bot.

TODO: Change the github account used at jenkins.

### Get current process log

Do "pm2 status" or "pm2 log".

### Remove auto start on boot

After running the code inside runbot.sh, a "pm2 save" command has been launched. Then, "pm2 startup" which gave the code: 

udo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>

To remove from boot run:

pm2 unstartup systemd


Features
===========

Static responses
--------------------
Use [The bot ontology](botOntology.json) to add static responses.

Please update always the key: "help" with new added entries. See the pattern.

Dinamic responses
--------------------
Use [UI_ACTIONS](src/Discord/UserActions.ts) array to add static responses.

Some dinamic features are:

- Random: It uses [Wikier List](wikier/data.txt) to output a randomized wiki entry.  
- Date: It launches a console command on server to get discordian date.  
- Registry: It operates with a json registry to register and read art works.  

