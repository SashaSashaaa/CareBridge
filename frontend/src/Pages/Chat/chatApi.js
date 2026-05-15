const API_BASE_URL = "/api/chat";

function getAccessToken() {
  return localStorage.getItem("access");
}

function getRefreshToken() {
  return localStorage.getItem("refresh");
}

function saveAccessToken(token) {
  localStorage.setItem("access", token);
}

function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("Refresh token відсутній.");
  }

  const response = await fetch("/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    logout();
    throw new Error("Сесія закінчилась. Увійдіть знову.");
  }

  saveAccessToken(data.access);

  return data.access;
}

async function request(url, options = {}, retry = true) {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401 && retry) {
    try {
      const newToken = await refreshAccessToken();

      return request(
        url,
        {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
          },
        },
        false
      );
    } catch (error) {
      throw error;
    }
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.receiver_id?.[0] ||
      data?.text?.[0] ||
      data?.non_field_errors?.[0] ||
      data?.message ||
      "";

    throw new Error(message);
  }

  return data;
}

// --------------------------------------------------
// USERS
// --------------------------------------------------

export function getChatUsers(type = "all") {
  return request(`/users/?type=${type}`);
}

// --------------------------------------------------
// REQUESTS
// --------------------------------------------------

export function getChatRequests(type = "all") {
  return request(`/requests/?type=${type}`);
}

export function sendChatRequest(receiverId) {
  return request("/requests/send/", {
    method: "POST",
    body: JSON.stringify({
      receiver_id: receiverId,
    }),
  });
}

export function acceptChatRequest(requestId) {
  return request(`/requests/${requestId}/accept/`, {
    method: "POST",
  });
}

export function declineChatRequest(requestId) {
  return request(`/requests/${requestId}/decline/`, {
    method: "POST",
  });
}

export function cancelChatRequest(requestId) {
  return request(`/requests/${requestId}/cancel/`, {
    method: "POST",
  });
}

// --------------------------------------------------
// CHATS
// --------------------------------------------------

export function getChats() {
  return request("/chats/");
}

export function getChatDetail(chatId) {
  return request(`/chats/${chatId}/`);
}

export function getChatMessages(chatId) {
  return request(`/chats/${chatId}/messages/`);
}

export function markMessagesAsRead(chatId) {
  return request(`/chats/${chatId}/messages/read/`, {
    method: "POST",
  });
}

export function deleteChat(chatId) {
  return request(`/chats/${chatId}/delete/`, {
    method: "POST",
  });
}

// --------------------------------------------------
// MESSAGES
// --------------------------------------------------

export function deleteMessage(messageId) {
  return request(`/messages/${messageId}/delete/`, {
    method: "POST",
  });
}