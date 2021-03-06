const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')
const moment = require('moment')

// Idea service
class IdeaService {
  constructor () {
    this.ideas = []
  }
  // This is where you can implement Database
  async find () {
    return this.ideas
  }

  async create (data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    }

    idea.time = moment().format('h:mm:ss')

    this.ideas.push(idea)

    return idea
  }
}

const app = express(feathers())

// Parse JSON
app.use(express.json())
// Config socket.io realtime APIs
app.configure(socketio())
// Enable REST services
app.configure(express.rest())
// Register services
app.use('/ideas', new IdeaService())

// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn))
// Publish events to stream
app.publish(data => app.channel('stream'))

const PORT = process.env.PORT || 3030

app.listen(PORT).on('listening', () => console.log(`Realtime server running on port ${PORT}`))

app.service('ideas').create({
  text: 'Build a cool app',
  tech: 'node.js',
  viewer: 'John Doe',
  time: moment().format('h:mm:ss')
})
