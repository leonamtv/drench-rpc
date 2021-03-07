from sys import argv 
from os import _exit

from threading import Thread
from core.drench import Drench

from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

import xmlrpc.client

LOCAL_SERVER_PORT = 3003
REMOTE_SERVER_PORT = 3001

d = Drench (6, 20)

def server ( functions ) :
    with SimpleXMLRPCServer(('0.0.0.0', LOCAL_SERVER_PORT),requestHandler=RequestHandler, logRequests=False) as server :
        server.register_introspection_functions ()
        for func in functions :
            server.register_function ( func['func'], func['name'] )
        server.serve_forever()

def update ( color ) :
    d.update_matrix ( color )
    print ( d )
    return color

thread = Thread(target=server, args=([{ 'func' : update, 'name' : 'update' },],))

class RequestHandler ( SimpleXMLRPCRequestHandler ) :
    rpc_paths = ('/RPC2')

def client_update ( color ) :
    with xmlrpc.client.ServerProxy (f"http://localhost:" + str(REMOTE_SERVER_PORT) + '/rpc') as proxy :
        proxy.update( int(color) )

def client_sync ( matrix ) :
    with xmlrpc.client.ServerProxy (f"http://localhost:" + str(REMOTE_SERVER_PORT) + '/rpc') as proxy :
        proxy.sync( matrix )

try :
    thread.start()
    client_sync ( d.matrix )
    print ( d )
    while True: 
        if d.remaining_paints () % 2 == 0 :
            if d.is_over () :
                print('GAME OVER!!!')
                _exit(1)
            print('Sua vez!!!')
            print ( d.get_options ()) 
            entry = int ( input ( 'Próximo valor: ' ))
            d.update_matrix ( entry )
            print ( d )
            client_update ( entry )
            if d.is_over () :
                print('GAME OVER!!!')
                if d.is_full () :
                    print('Você ganhou!')
                _exit(1)
        else :
            if d.is_over () :
                print('GAME OVER!!!')
                if d.is_full () :
                    print('Você ganhou!')
                _exit(1)
    
    thread.join()
        
except KeyboardInterrupt :
    print('Bye')
except EOFError:
    print('Bye')
