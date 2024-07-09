import z from 'zod'

const usuarioEsquema = z.object({
  nombre: z.string({
    invalid_type_error: 'El nombre debe ser un texto.',
    required_error: 'El nombre es obligatorio.'
  }).min(5, { message: 'El nombre debe contener al menos 5 carácteres.' }),
  correo: z.string({
    required_error: 'El corrreo es obligatorio.'
  }).email({ message: 'Correo electrónico inválido' }),
  contraseya: z.string({
    invalid_type_error: 'La contraseña debe ser un texto.',
    required_error: 'La contraseña es obligatoria.'
  }).min(10, { message: 'La contraseña debe contener al menos 10 carácteres.' }),
  estado: z.string({
    invalid_type_error: 'Estado obligatorio (Activo o Baja).',
    required_error: 'Estado obligatorio (Activo o Baja).'
  }).min(1, { message: 'Estado obligatorio (Activo o Baja).' }),
  seguridad: z.string().array()
})

export function validateUsuario (input) {
  return usuarioEsquema.safeParse(input)
}

export function validatePartialUsuario (input) {
  return usuarioEsquema.partial().safeParse(input)
}
