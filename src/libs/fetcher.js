const api = import.meta.env.VITE_API;
export const take = Number(20);

export const getToken = () => {
  return localStorage.getItem("token");
};

export async function postUser(data) {
  const res = await fetch(`${api}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}
export async function createPost(content) {
  const token = getToken();

  const res = await fetch(`${api}/content/posts`, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}
export async function createComment(content, postId) {
  const token = getToken();
  const res = await fetch(`${api}/content/comments`, {
    method: "POST",
    body: JSON.stringify({ content, postId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function postLogin(username, password) {
  const res = await fetch(`${api}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json();
  }
  throw new Error("Incorrect username or password");
}
export async function fetchUser(id) {
  const token = getToken();
  const res = await fetch(`${api}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function fetchVerify() {
  const token = getToken();
  const res = await fetch(`${api}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}

export async function postPostLike(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/like/posts/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function postCommentLike(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/like/comments/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
export async function deletePostLike(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/unlike/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
export async function deleteCommentLike(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/unlike/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
export async function fetchPostLikes(id) {
  const res = await fetch(`${api}/content/likes/posts/${id}`);
  return res.json();
}
export async function fetchCommentLikes(id) {
  console.log(id);

  const res = await fetch(`${api}/content/likes/comments/${id}`);
  return res.json();
}

export async function postFollow(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/follow/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
export async function deleteFollow(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/unfollow/${id}`, {
    method: "Delete",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function SearchUser(q, skip) {
  const res = await fetch(`${api}/search/${skip}/${take}?q=${q}`, {});
  return res.json();
}

export async function fetchFollowingPosts(skip) {
  const token = getToken();
  const res = await fetch(`${api}/content/following/posts/${skip}/${take}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}

export async function fetchNotis() {
  const token = getToken();
  const res = await fetch(`${api}/content/notis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}
export async function putAllNotisRead() {
  const token = getToken();
  const res = await fetch(`${api}/content/notis/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}
export async function putNotisRead(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/notis/read/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}
