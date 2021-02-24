from random import randrange

class Drench :

    def __init__ ( self, size = 6, max_count = 20, matrix = [] ) :
        self.size = size
        self.game_over = False
        self.max_count = max_count
        self.paints_count = 0

        if len ( matrix ) == 0 :
            self.matrix = [[ randrange(self.size) for _ in range ( self.size )] for _ in range ( self.size )]
        else :
            self.matrix = matrix

    def get_options ( self ) :
        aux = ''
        for i in range ( self.size ) :
            aux += ( colors[i] + '▄' if i < len ( colors ) else '' ) + ' '
        aux += '\n'
        for i in range ( self.size ) :
            aux += str(i) + ' '
        return aux + '\n'

    def __repr__ ( self ) :
        aux = ''
        for i in range ( self.size ):
            for j in range ( self.size ):
                aux += (( colors[self.matrix[i][j]] + '▄' ) \
                    if i < self.size and \
                       j < self.size and \
                       self.matrix[i][j] < len(colors) \
                    else '' ) + ' '
            aux += '\n'
        return aux

    def remaining_paints ( self ) :
        return self.max_count - self.paints_count

    def is_over ( self ) :
        if self.paints_count >= self.max_count :
            return True
        val = self.matrix[0][0]
        cont = 0
        for i in range ( self.size ) :
            for j in range ( self.size ) :
                if self.matrix[i][j] != val  :
                    return False
                cont += 1
        return cont == ( self.size ** 2 )

    def _propagate_color ( self, color, old_color, x = 0, y = 0 ) :
        if x >= self.size or y >= self.size or x < 0 or y < 0 :
            return
        if self.matrix[x][y] != old_color and ( x != 0 or y != 0 ) :
            return
        self.matrix[x][y] = color

        self._propagate_color ( color, old_color, x, y + 1 )
        self._propagate_color ( color, old_color, x, y - 1 )
        self._propagate_color ( color, old_color, x + 1, y )
        self._propagate_color ( color, old_color, x - 1, y )

    def update_matrix ( self, color ) :
        if color >= self.size :
            raise Exception ('Color not supported')
        if self.game_over or color == self.matrix[0][0] :
            return
        self.paints_count += 1
        self._propagate_color ( color, self.matrix[0][0] )
        


        


colors = [

    '\33[31m',
    '\33[32m',
    '\33[33m',
    '\33[35m',
    '\33[95m',
    '\33[34m',
    '\33[94m',
    '\33[36m',
    '\33[105m',
    '\33[92m'

]