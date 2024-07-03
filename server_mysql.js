import { createApp } from './app.js'

import { UsuarioModelo } from './modelos/mysql/usuario.js'

createApp({ usuarioModelo: UsuarioModelo })
