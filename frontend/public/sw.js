// frontend/public/sw.js
self.addEventListener('push', function(event) {
    const data = event.data.json();
    const title = data.title;
    const options = {
        body: data.body,
        icon: data.icon,
        data: data.data
    };
    event.waitUntil(self.registration.showNotification(title, options));
});
