from core.drench import Drench

try :
    d = Drench (6, 30)
    while True :
        if d.is_over () :
            print ( d )
            print (r'¯\_(ツ)_/¯ Game is over')
            break
        else :
            print ( d )
            print ( d.get_options())

            print ( str(d.remaining_paints()) + ' tentativas restando\n' )

            entry = int ( input ( 'Próximo valor: \n' ))
            d.update_matrix ( entry )
except KeyboardInterrupt :
    print('\b\bBye')
except EOFError:
    print('Bye')