export const filterPosts = ( posts, userId ) => (
  Object.values(posts)
    .filter( post => post.page_id === userId )
    .sort( (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) )
);

export const filterFeedPosts = ( posts, friendIds ) => (
  Object.values(posts)
    .filter( post => friendIds.includes( post.page_id ) )
    .sort( (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) )
);

export const addAuthorToPosts = ( posts, users ) => (
  Object.values(posts).map( post => {
    const author = users[post.author_id];
    const author_fullname = `${author.first_name} ${author.last_name}`;
    post.author = author_fullname;
    return post;
  })
);

export const filterPostComments = ( comments, postId, parentId, n ) => (
  Object.values(comments)
    .filter( comment => comment.commentable_id === postId &&
      comment.commentable_type === "Post" &&
      comment.parent_id === parentId )
    .sort( (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
    .slice(0, n)
);

export const countPostComments = ( comments, postId ) => (
  Object.values(comments)
    .filter( comment =>
      comment.commentable_id === postId && comment.commentable_type === "Post" )
    .length
);

export const getRelationship = ( currentUserId, profileUserId, userRelationships ) => {
  const [rel] = Object.values(userRelationships)
  .filter( rel =>
    ( rel.user1_id ===  currentUserId && rel.user2_id === profileUserId)
    || ( rel.user1_id === profileUserId && rel.user2_id ===  currentUserId)
  );
  return rel;
};

export const getRelType = ( currentUserId, profileUserId, userRelationships  ) => {

  let rel = "none";

  if ( currentUserId === profileUserId ) {
    return "self";
  }

  const relationship = getRelationship( currentUserId, profileUserId, userRelationships) ;

  if ( relationship === undefined ) {
    rel = "none";
  } else {
    const { rel_type, user1_id } = relationship;
    if ( rel_type === "accepted" ) {
      rel = "friends";
    } else if ( rel_type === "pending" ) {
      if ( user1_id === currentUserId ) {
        rel = "request sent"
      } else {
        rel = "request received"
      }
    }
  }
  return rel;

};

export const filterRelationships = ( currentUserId, userRelationships, rel_type ) => (
  Object.values(userRelationships)
    .filter( rel =>
      ( rel.user1_id === currentUserId || rel.user2_id === currentUserId ) &&
      rel.rel_type === rel_type
    )
    .map( rel => rel.user1_id === currentUserId ? rel.user2_id : rel.user1_id )
);

export const filterFriends = ( users, friendIds, sortCallback ) => {

  return Object.values(users)
    .filter( user => friendIds.includes(user.id) )
    .sort( sortCallback ? sortCallback : (a, b) => `${a.first_name} ${a.last_name}` - `${b.first_name} ${b.last_name}` );
};



export const getPendingFriendRequests = ( currentUserId, userRelationships ) => (
  Object.values(userRelationships)
    .filter( rel => rel.user2_id === currentUserId && rel.rel_type === "pending" )
    .sort( (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) )
);

export const filterUsers = ( userIds, users ) => (
  userIds.map( id => users[id] )
);

export const filterLikes = ( likeableId, likeableType, likes ) => (
  Object.values(likes)
    .filter( like => like.likeable_id === likeableId && like.likeable_type === likeableType )
);

export const filterLikeByUser = ( currentUserId, likeableId, likeableType, likes ) => (
  Object.values(likes)
    .filter( like =>
      like.likeable_id === likeableId &&
      like.likeable_type === likeableType &&
      like.user_id === currentUserId
    )
);