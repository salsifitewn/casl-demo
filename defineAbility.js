import { defineAbility } from '@casl/ability'

export const ability = defineAbility((can, cannot) => {
  can('manage', 'all')
  cannot('delete', 'User')
})

export const defineAbilityFor = (user) =>
  defineAbility((can) => {
    can('read', 'Article')

    if (user.isLoggedIn) {
      can('update', 'Article', { authorId: user.id })
      can('create', 'Comment')
      can('update', 'Comment', { authorId: user.id })
    }
  })

export const defineAbilityForWithField = (user) =>
  defineAbility((can) => {
    can('read', 'Article')
    can('update', 'Article', ['title', 'description'], { authorId: user.id })

    if (user.isModerator) {
      can('update', 'Article', ['published'])
    }
  })
