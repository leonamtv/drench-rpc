const drench = require('../core/drench')
const prompt = require('prompt-sync')();

const d = drench(6, 20)
d.init()

while ( true ) {
    if ( d.isOver ()) {
        d.print()
        console.log('¯\_(ツ)_/¯ Game is over')
        break
    } else {
        d.print()
        console.log(d.getOptions())
        console.log(d.remainingPaints() + ' tentativas restantes\n')
        const entry = prompt('Próximo valor:');
        d.updateMatrix ( parseInt ( entry ))
    }
}