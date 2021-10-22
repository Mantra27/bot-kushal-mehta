const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageComponentInteraction } = require('discord.js');
const music = require('@koenie06/discord.js-music');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const fs = require('fs');

let volume = 1;

let row = new MessageActionRow()
            .addComponents(
				new MessageButton()
					.setCustomId('vup')
					.setLabel('Volume +10 🔼')
					.setStyle('PRIMARY'),
			).addComponents(new MessageButton()
					.setCustomId('vdown')
					.setLabel('Volume -10 🔽')
					.setStyle('PRIMARY'),
)

/* This code will run when the client receives a interaction */

client.on('ready', ()=>{

    console.log(client.user.tag)

    client.user.setActivity("use +help", {
        type: "STREAMING"
      });

})


client.on('messageCreate', async (msg) => {
    
    console.log(msg.content)

   
        if(msg.content.includes('+play')){
                
            if(!msg.member.voice.channel){
                msg.reply('get into vc first')
            }

            else{
            let song = msg.content.split('+play')[1]
            const channel = msg.member.voice.channel;
        
           music.play({

               interaction: msg,
               channel: channel,
               song: song,

            }).then(async ()=>{

            let queue_count = await music.getQueue({ interaction: msg }).then(async (e)=>{
                return e.length;
            })

            if(queue_count == 1){

                await music.getQueue({ interaction: msg }).then(async (e)=>{
                    let slide = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(e[e.length-1].info.title)
                    .setURL(e[e.length-1].info.url)
                    .setImage(e[e.length-1].info.thumbnail)
                    .setDescription(e[e.length-1].info.description);
    
                    await msg.reply({embeds:[slide]})
                    console.log(e[e.length-1].info)
                })

            }

            else{

                let reply_is = await music.getQueue({ interaction: msg }).then(async (e)=>{
                    return e[e.length - 1].info.title;
                })

                let queue_count = await music.getQueue({ interaction: msg }).then(async (e)=>{
                    return e.length;
                })

                msg.reply(`next queue(${queue_count}) is ${reply_is}`)
            }
            }).catch((e)=>{

                   msg.reply('taru song to nai madtu yaar, sarkhu name lakhne jarak')
                   console.log(e)

                })
            }
        }
    
    
        let skipper = 1;
        if(msg.content == '+skip'){

            if(!msg.member.voice.channel){

                msg.reply('get into vc first')

            }
                else{

                    let counter  = await music.getQueue({ interaction: msg }).then(async (e)=>{
                        return e.length;
                    })

                    console.log(skipper, counter)

                    if(skipper<counter){

                        await music.skip({ interaction: msg })
                        await music.getQueue({ interaction: msg }).then(async (e)=>{

                            let slide = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(e[0].info.title)
                            .setURL(e[0].info.url)
                            .setImage(e[0].info.thumbnail)
                            .setDescription(e[0].info.description);
                            
                            await msg.reply({embeds:[slide]})
                            console.log(e[0].info)

                        })  

                    }
                    else{

                        msg.reply('im playing last song in the queue, can not skip anymore.')

                    }
                
        }
        }
        if(msg.content == '+resume' || msg.content == '+r'){

            if(!msg.member.voice.channel){

                msg.reply('get into vc first')

            }
            else{

            music.resume({ interaction: msg })

            }
        }

        if(msg.content == '+pause' || msg.content == '+p'){
            if(!msg.member.voice.channel){
                msg.reply('get into vc first')
            }
                else{
                    music.pause({ interaction: msg })
                }   
        }

        if(msg.content == '+q' || msg.content == '+queue'){
            if(!msg.member.voice.channel){
                msg.reply('get into vc first')
            }

                else{   

                    let bruh = music.getQueue({ interaction: msg }).info.then((e)=>{
                        return e.length;
                    })

                    console.log(music.getQueue({ interaction: msg }).info)
                    let rec_count = 0;
                    const recur = () =>{
                        if(rec_count<=bruh){
                            recur();
                            msg.channel.send(music.getQueue({ interaction: msg }).info.then((e)=>{
                                return e[rec_count].info.title;
                            }))
                            rec_count++
                        }
                        else{

                        }
                    }
                }
        }

        if(msg.content == '+help'){
            if(!msg.member.voice.channel){
                msg.reply('get into vc first')
            }
                else{
                setTimeout(()=>{
                    music.skip({ interaction: msg })
                }, 1500)
        }
        }

        if(msg.content.includes('+volume') || msg.content.includes('+v')){

            if(!msg.member.voice.channel){
                msg.reply('get into vc first')
            }

            else{

            
            if(!msg.content.split('+volume')[1]){
                msg.reply('how much to set the volume?')
            }

            if(Number.isInteger(msg.content.split('+volume')[1])){
                console.log('err')
            }

            volume = parseInt(msg.content.split('+volume')[1])

            music.volume({
                interaction: msg,
                volume: volume/100
            });

        }
        
    };
    if(msg.content.includes('+clear')){
        if(msg.content.split('+clear')[1]>100){
            msg.reply('cannot delete more than 100 texts')
        }
        let deleteCount = parseInt(msg.content.split('+clear')[1])
        msg.channel.bulkDelete(deleteCount + 1).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        }
});

client.login('OTAwNzcxMTU2ODE3MjM1OTY4.YXGKgw.4lawJ4Pn9_jzTYxUb8_Igj8dVdE');
