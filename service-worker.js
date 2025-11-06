// service-worker.js

self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push a été reçu !', data);

  const title = data.title || 'Pharma Garde';
  const options = {
    body: data.body,
    icon: '/logo192.png', // Assurez-vous d'avoir un logo à cette emplacement
    badge: '/logo72.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  console.log('La notification a été cliquée', event.notification);
  event.notification.close();
  // Ici, vous pouvez ajouter une logique pour ouvrir une fenêtre/onglet spécifique
  // event.waitUntil(clients.openWindow('https://example.com'));
});
