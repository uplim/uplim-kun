import 'dotenv/config'
import { Events, Client, GatewayIntentBits } from 'discord.js'
import { messages, reactions } from './constants'
import { sleep } from './utils'

async function main (): Promise<void> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers
    ]
  })

  client.login(process.env.PRIVATE_TOKEN).catch(e => { console.error(e) })

  client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot) {
      return
    }

    if (client.user !== null && msg.mentions.users.has(client.user.id)) {
      const message = random(messages, 1)
      const reacts = random(reactions, 2)
      await sleep(3000)
      await msg.reply(message[0])
      await msg.react(reacts[0])
      await msg.react(reacts[1])
    }
  })
}

function random (array: string[], num: number): string[] {
  const newArray: string[] = []

  while (newArray.length < num && array.length > 0) {
    const rand = Math.floor(Math.random() * array.length)
    newArray.push(array[rand])
    array.splice(rand, 1)
  }

  return newArray
}

main().catch(e => { console.error(e) })
