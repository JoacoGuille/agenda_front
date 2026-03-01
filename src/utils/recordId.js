export const obtenerId = (item) => {
  if (!item || typeof item !== 'object') return null

  return (
    item.id ??
    item._id ??
    item.friendId ??
    item.groupId ??
    item.userId ??
    item.memberId ??
    item.friend?.id ??
    item.user?.id ??
    item.group?.id ??
    null
  )
}
