const xmlrpc = require('xmlrpc')
const drench = require('./core/drench')
const prompt = require('prompt-sync')();

// const d = drench(6, 20)
const d = drench(4, 20)
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

const cliente_end = ( entry  ) => {
    return new Promise (( resolve, reject ) => {
        return client.methodCall('end', [ ], (error, value) => {
            if (error) { return reject(error); }
            return resolve ( value );
        })
    })
}

const start = () => {
    let refreshId = setInterval(async () => {
        if ( d.remainingPaints() % 2 == 1 ) {
            if ( d.isOver () ) {
                console.log('GAME OVER!!!')
                process.exit()
            }
            console.log ('Sua vez!!!')
            console.log ( d.getOptions()) 
            const entry = prompt('Próximo valor: ')
            d.updateMatrix ( parseInt(entry) )
            d.print()
            await cliente( entry ) 
            if ( d.isOver () ) {
                console.log('GAME OVER!!!')
                if (  d.isFull() ) {
                    console.log('Você ganhou!')
                }
                process.exit()
            }
        } else {
            if ( d.isOver () ) {
                console.log('GAME OVER!!!')
                if (  d.isFull() ) {
                    console.log('Você ganhou!')
                }
                process.exit()
            }
        }
    }, 500)
}

start()

const server = xmlrpc.createServer ({
    host : '0.0.0.0',
    port : LOCAL_SERVER_PORT,
    path: '/rpc'
})

server.on ( 'update', ( err, params, callback ) => {
    d.updateMatrix ( parseInt(params[0])) 
    d.print()
    callback ( null, 'updated' )
})

server.on ( 'sync', ( err, params, callback ) => {
    d.sync ( params[0] )
    d.print()
    callback ( null, 'synced' )
})

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
  });