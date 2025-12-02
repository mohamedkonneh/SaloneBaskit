console.log("Service Worker Loaded");

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push Received...");
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icon-192x192.png", // Make sure you have an icon in your public folder
    });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://localhost:5173') // Change to your production URL
  );
});