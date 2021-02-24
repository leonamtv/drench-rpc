const colors = require ('colors')

const drench = ( size = 6, maxCount = 20, matrix = [] ) => {

    let _matrix
    let game_over = false
    let _maxCount = maxCount
    let paintsCount = 0

    const init = () => {
        if ( matrix.length == 0 ) {
            _matrix = Array(size)
            for ( let i = 0; i < size; i++ ) {
                _matrix[i] = Array(size)
                for ( let j = 0; j < size; j++ ) {
                    _matrix[i][j] = randInt() % size
                }
            }
        }
    }

    const propagate = (color, oldColor, x = 0, y = 0  ) => {
        if ( x >= size || y >= size || x < 0 || y < 0 ) return
        if ( _matrix[x][y] != oldColor && ( x != 0 || y != 0 )) return
        _matrix[x][y] = color
        propagate ( color, oldColor, x, y + 1 )
        propagate ( color, oldColor, x, y - 1 )
        propagate ( color, oldColor, x + 1, y )
        propagate ( color, oldColor, x - 1, y )
    }

    const gameOver = () => {
        if ( paintsCount >= _maxCount ) 
            return true
        let val = _matrix[0][0]
        let cont = 0
        for ( let i = 0; i < size; i ++ ) {
            for ( let j = 0; j < size; j ++ ) {
                if ( _matrix[i][j] != val )
                    return false
                cont += 1
            }
        }
        return cont == ( size * size )
    }

    const remainingPaints = () => {
        return _maxCount - paintsCount
    }

    const print = () => {
        for ( let i = 0; i < size; i ++ ) {
            let str = ''
            for ( let j = 0; j < size; j ++ ) {
                str += array_colors[ _matrix[i][j] ] + ' '
            }
            console.log(str)
        }
        console.log()
    }

    const getOptions = () => {
        let aux = ''
        for ( let i = 0; i < size; i ++ ) 
            aux += array_colors[ i ] + ' '
        aux += '\n'
        for ( let i = 0; i < size; i ++ ) 
            aux += i + ' '
        aux += '\n'
        return aux
    }

    const updateMatrix = ( color ) => {
        if ( game_over || color == _matrix[0][0]) return
        paintsCount ++
        propagate ( color, _matrix[0][0] )
    }

    const randInt = ( max = 100, min = 20) => {
        return Math.floor(Math.random() * ( max - min + 1)) + min
    }

    const array_colors = [
        '▄'.green,
        '▄'.red,
        '▄'.blue,
        '▄'.yellow,
        '▄'.magenta,
        '▄'.cyan,
        '▄'.brightRed,
        '▄'.grey,
    ]

    return {
        'init'            : init,
        'getOptions'      : getOptions,
        'print'           : print,
        'remainingPaints' : remainingPaints,
        'isOver'          : gameOver,
        'propagateColor'  : propagate,
        'updateMatrix'    : updateMatrix
    }

}

module.exports = drench