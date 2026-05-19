
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'Ha ocurrido un error inesperado.'

  const code = error.code || (error as any).status?.toString()

  switch (code) {
    case 'user_already_exists':
    case '422':
      return 'Este correo electrónico ya está registrado. Intenta iniciar sesión.'

    case 'invalid_credentials':
    case 'invalid_grant':
      return 'El correo o la contraseña no son correctos.'

    case 'email_not_confirmed':
      return 'Debes confirmar tu correo electrónico antes de poder entrar.'

    case 'weak_password':
      return 'La contraseña es muy débil. Debe tener al menos 6 caracteres y ser más compleja.'

    case 'over_email_send_rate_limit':
      return 'Has solicitado demasiados correos de confirmación. Espera unos minutos.'

    case 'over_request_rate_limit':
      return 'Demasiadas peticiones en poco tiempo. Por favor, espera un momento.'

    case 'user_not_found':
      return 'No hemos encontrado ningún usuario con esos datos.'

    case 'session_not_found':
    case 'session_expired':
      return 'Tu sesión ha terminado. Por favor, entra de nuevo.'

    default:
      const message = error.message?.toLowerCase() || ''

      if (message.includes('already registered')) {
        return 'Este correo electrónico ya está registrado.'
      }
      if (message.includes('invalid login credentials')) {
        return 'Credenciales incorrectas.'
      }
      if (message.includes('rate limit')) {
        return 'Has excedido el límite de intentos. Reintenta en unos minutos.'
      }

      return error.message || 'Error de conexión con el servidor.'
  }
}
