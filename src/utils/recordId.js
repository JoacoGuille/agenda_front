export const obtenerId = (item) => {
  if (!item || typeof item !== 'object') return null

  return (
    item.id ??
    item._id ??
    item.friendId ??
    item.groupId ??
    item.userId ??
    item.memberId ??
    item.group?._id ??
    item.friend?.id ??
    item.friend?._id ??
    item.user?.id ??
    item.user?._id ??
    item.group?.id ??
    item.member?._id ??
    item.member?.id ??
    null
  )
}
