const xmlrpc = require('xmlrpc')
const drench = require('./core/drench')
const prompt = require('prompt-sync')();

const d = drench(6, 20)
d.init()

const LOCAL_SERVER_PORT = 3001
const REMOTE_SERVER_PORT = 3003

let client = xmlrpc.createClient ({ 

    host : '0.0.0.0',
    port : REMOTE_SERVER_PORT,
    path : '/'
})

const cliente = ( entry  ) => {
    return new Promise (( resolve, reject ) => {
        return client.methodCall('update', [ parseInt ( entry ) ], (error, value) => {
            if (error) { return reject(error); }
            return resolve ( value );
        })
    })
}

const start = () => {
    setInterval(async () => {
        if ( d.remainingPaints() % 2 == 1 ) {
            console.log ('Sua vez!!!')
            console.log ( d.getOptions()) 
            const entry = prompt('Próximo valor:')
            d.updateMatrix ( parseInt(entry) )
            await cliente( entry )
        }

    }, 300)
}

start()

const server = xmlrpc.createServer ({
    host : '0.0.0.0',
    port : LOCAL_SERVER_PORT,
    path: '/rpc'
})

server.on ( 'update', ( err, params, callback ) => {
    console.log('chamado')
    d.updateMatrix ( parseInt(params[0])) 
    d.print()
    callback ( null, 'updated' )
})

server.on ( 'sync', ( err, params, callback ) => {
    d.sync ( params[0] )
    d.print()
    callback ( null, 'synced' )
})



