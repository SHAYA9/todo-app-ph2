---
title: Todo App
emoji: ✅
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Todo App - Full Stack Task Manager

A modern, full-stack todo application with smart features built with Next.js and FastAPI.

## 🚀 Features

- ✅ Create, update, and delete tasks
- 🔍 Search and filter tasks
- 📊 Priority levels (Low, Medium, High)
- 📅 Due dates with notifications
- ✔️ Task completion tracking
- 🔔 Browser notifications for upcoming tasks
- 📱 Responsive design
- ⚡ Real-time updates

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS v4
- Browser Notifications API

**Backend:**
- FastAPI (Python)
- SQLModel (ORM)
- PostgreSQL
- Pydantic for validation

## 🎯 How to Use

1. **Add a Task:** Click "Add Task" and fill in the details
2. **Set Priority:** Choose Low, Medium, or High priority
3. **Add Due Date:** Set a due date to receive notifications
4. **Search & Filter:** Use the search bar and filters to find tasks
5. **Complete Tasks:** Check off tasks when done
6. **Delete Tasks:** Remove tasks you no longer need

## 🔔 Notifications

The app will send you browser notifications 15 minutes before a task is due!

## 🗄️ Database

This app uses PostgreSQL for data persistence. To use your own database:
1. Get a free PostgreSQL database from [Neon](https://neon.tech)
2. Add the `DATABASE_URL` secret in Space settings
3. Redeploy the space

## 📝 Environment Variables

Set these in your Hugging Face Space settings:

- `DATABASE_URL`: PostgreSQL connection string (Required)

Example:
```
postgresql://user:password@host:port/database?sslmode=require
```

## 🎨 Screenshots

[Add screenshots of your app here]

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

Built with ❤️ using Next.js and FastAPI