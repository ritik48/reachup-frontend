const BACKEND = import.meta.env.VITE_BACKEND || "http://127.0.0.1:3000";

// TO GET THE LOGGED IN USER DETAILS
const getUser = async () => {
  const res = await fetch(`${BACKEND}/user`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();

  return data;
};

const userLogin = async (email: string, password: string) => {
  const res = await fetch(`${BACKEND}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  return data;
};

const userSignup = async (name: string, email: string, password: string) => {
  const res = await fetch(`${BACKEND}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();

  return data;
};

const userLogout = async () => {
  const res = await fetch(`${BACKEND}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();

  return data;
};

const addEmailSender = async (values: any) => {
  const { host, port, email, password, provider, name } = values;

  const res = await fetch(`${BACKEND}/user/email-sender`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ host, port, email, password, name, provider }),
  });

  const data = await res.json();

  return data;
};

const verifyEmailSender = async (id: string) => {
  const res = await fetch(`${BACKEND}/user/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  const data = await res.json();

  return data;
};

const deleteEmailSender = async (id: string) => {
  const res = await fetch(`${BACKEND}/user/email-sender`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  const data = await res.json();

  return data;
};

const fetchConnectedEmails = async () => {
  const res = await fetch(`${BACKEND}/user/email-sender`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  return data;
};

const fetchLeads = async () => {
  const res = await fetch(`${BACKEND}/leads`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  return data;
};

const fetchLeadsById = async (id: string) => {
  const res = await fetch(`${BACKEND}/leads/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  return data;
};

const uploadfile = async (formData: FormData) => {
  const response = await fetch(`${BACKEND}/leads/upload-lead`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

const finalSaveLead = async (id: string, header: string[], title: string) => {
  const response = await fetch(`${BACKEND}/leads/lead-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, header, title }),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

const createLead = async (title: string) => {
  const response = await fetch(`${BACKEND}/leads/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

const fetchLeadItems = async (id: string) => {
  const response = await fetch(`${BACKEND}/leads/items/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export {
  getUser,
  userLogin,
  userSignup,
  userLogout,
  addEmailSender,
  fetchConnectedEmails,
  verifyEmailSender,
  deleteEmailSender,
  fetchLeads,
  fetchLeadsById,
  uploadfile,
  finalSaveLead,
  createLead,
  fetchLeadItems,
};
