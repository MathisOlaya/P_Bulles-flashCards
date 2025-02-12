import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'Le champ est requis.',
  'string': 'Le champ doit être une chaine de caractère.',
  'email': 'The value is not a valid email address',
  'minLength': 'Le champ ne respècte pas la taille minimale.',
  'password.confirmed': 'Les deux mots de passes ne correspondent pas.',
  'unique': 'Un utilisateur existe déjà avec ce nom.',
})
