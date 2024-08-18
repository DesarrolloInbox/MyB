import { createApp } from './app.js'

import { UsuarioModelo } from './modelos/sqlite/usuario.js'

createApp({ usuarioModelo: UsuarioModelo })
