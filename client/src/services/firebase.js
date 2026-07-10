import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, serverTimestamp } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, db, storage;

if (firebaseConfig.projectId && firebaseConfig.projectId !== 'your-project-id') {
  app     = initializeApp(firebaseConfig);
  db      = getDatabase(app);
  storage = getStorage(app);
} else {
  console.warn('Firebase not configured — chat, photo uploads, and notifications will be disabled.');
}

// ── Chat helpers ──────────────────────────────────────
export const subscribeChatMessages = (eventId, callback) => {
  const chatRef = ref(db, `chats/${eventId}`);
  onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data
      ? Object.entries(data).map(([id, msg]) => ({ id, ...msg })).sort((a, b) => a.timestamp - b.timestamp)
      : [];
    callback(messages);
  });
  return () => off(chatRef);
};

export const sendChatMessage = async (eventId, message, user) => {
  const chatRef = ref(db, `chats/${eventId}`);
  await push(chatRef, {
    text:      message,
    userId:    user.id,
    userName:  user.name,
    timestamp: Date.now(),
  });
};

export const uploadEventImage = async (eventId, file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset    = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error('Cloudinary is not configured. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  formData.append('folder', `eventhive/${eventId}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    // Cloudinary returns { error: { message: "..." } } on failure
    throw new Error(data?.error?.message || 'Cloudinary upload failed');
  }
  return { url: data.secure_url, path: data.public_id };
};

export const deleteEventImage = async () => {
  // Deleting requires a signed request (needs your API secret), which
  // can't safely run in the browser. For now this is a no-op — the image
  // stays in Cloudinary but is removed from the event's gallery list below.
  return true;
};
// ── Messaging helpers ─────────────────────────────────
export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch {
    console.warn('Notification permission not granted');
    return null;
  }
};

export { db, storage };
