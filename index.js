import {
  ability,
  defineAbilityFor,
  defineAbilityForWithField,
} from './defineAbility.js'
import chalk from 'chalk'
import { Article } from './models.js'
import { defineAbility } from '@casl/ability'

console.log(`Hello Node.js v${process.versions.node}!`)
const log =
  (color) =>
  (expression, ...args) =>
    console.log(color(expression, ...args))
const rc = (predicate) =>
  predicate ? chalk.green(predicate) : chalk.red(predicate)

///////////////////////////////////////////////
;(() => {
  const lc = log(chalk.white)
  lc('BASIC')
  lc('can read Post', ability.can('read', 'Post')) // true
  lc('can read User', ability.can('read', 'User')) // true
  lc('can update User', ability.can('update', 'User')) // true
  lc('can delete User', ability.can('delete', 'User')) // false
  lc('cannot deslete User', ability.cannot('delete', 'User')) // true
})()
///////////////////////////////////////////////
;(() => {
  const lc = log(chalk.blue)
  lc('SUBJECT')
  lc(
    "An user can read any Article\n can update own Article's \n can create a Comment for any Article \n can update own Comment"
  )
  const user = { id: 1, isLoggedIn: true }
  const userAbility = defineAbilityFor(user)
  defineAbilityFor(user)
  let article = new Article()
  lc(userAbility.can('read', article))
  const ownArticle = new Article({ authorId: 1, name: 'ferrari' })
  lc('article2.constructor.name == ' + ownArticle.constructor.name)
  lc(userAbility.can('update', ownArticle))
})()
///////////////////////////////////////////////
;(() => {
  const lc = log(chalk.magenta)
  lc('FIELD')
  const moderator = { id: 2, isModerator: true }
  const ownArticle = new Article({ authorId: moderator.id })
  const foreignArticle = new Article({ authorId: 10 })
  const ability = defineAbilityForWithField(moderator)

  lc('moderator can read any Article ' + rc(ability.can('read', 'Article'))) // true
  lc(
    'moderator can update field published of any Article ' +
      rc(ability.can('update', 'Article', 'published'))
  ) // true
  lc(
    'moderator can update field title of his own Article ' +
      rc(ability.can('update', ownArticle, 'description'))
  ) // true
  lc(
    "moderator can update field title of other's Article ",
    rc(ability.can('update', foreignArticle, 'title'))
  ) // false
})()
///////////////////////////////////////////////
;(() => {
  const lc = log(chalk.yellow)
  lc('Inverted rules')
  const AdminAbility = defineAbility((can, cannot) => {
    can('manage', 'all') // manage for all actions ,all for on all entities
    cannot('delete', 'all')
  })

  lc('admin can read any Post ' + rc(AdminAbility.can('read', 'Post'))) // true
  lc('admin can delete any Post ' + rc(AdminAbility.can('delete', 'Post'))) // true
})()
