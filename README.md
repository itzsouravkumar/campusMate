
# 🎓 CampusMate Discord Bot

CampusMate is a powerful, modular Discord bot built for colleges and universities. It streamlines event management, club coordination, and student engagement directly within Discord servers.

---

## 🚀 Features

- 📅 Create, manage, and list events
- 👥 Role-based access for club heads and admins
- 📸 Upload event images and build a gallery
- 📝 User registration and attendance tracking
- 🔔 Event reminders and announcements
- 💾 Data storage using [Supabase](https://supabase.io)
- 📊 (Planned) Web dashboard integration with Next.js

---

## 🧰 Tech Stack

| Layer      | Technology              |
|------------|--------------------------|
| Language   | TypeScript (Node.js)     |
| Framework  | [discord.js](https://discord.js.org) v14 |
| Database   | Supabase (PostgreSQL + Auth) |

---

## 📦 Project Structure

```
CampusMate/
├── src/
│   ├── commands/           # Slash command modules
│   ├── events/             # Event handlers (ready, interactionCreate)
│   ├── lib/                # Supabase client, utilities
│   ├── types/              # Custom TypeScript types
│   ├── config/             # Bot config, constants
│   └── index.ts            # Entry point
├── .env                    # Environment variables
├── .gitignore              # Ignored files/folders
├── tsconfig.json           # TypeScript config
└── README.md               # This file
```

---

## 🔐 Environment Variables (`.env`)

```env
DISCORD_TOKEN=your_discord_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

---

## 🛠 Setup Instructions

### ✅ Prerequisites
- Node.js ≥ 18
- pnpm / npm / yarn
- Discord bot with privileged intents enabled
- Supabase project setup

### 📦 Installation

```bash
git clone https://github.com/your-username/CampusMate.git
cd CampusMate
pnpm install
```

### ⚙️ Configuration

1. Create a `.env` file in the root
2. Paste your bot token and Supabase credentials

### 🧪 Run the Bot (Development)

```bash
pnpm run dev
```

### 🚀 Run the Bot (Production)

```bash
pnpm run build
pnpm start
```

---

## 🧠 Planned Commands (Examples)

| Command          | Description                              |
|------------------|------------------------------------------|
| `/createevent`   | Add new event with name, date, club tag  |
| `/listevents`    | List all upcoming events                 |
| `/register`      | Register for an event                    |
| `/markattendance`| Mark attendance of users                 |
| `/addeventimage` | Upload event images                      |
| `/myregistrations` | View user's registered events         |

---

## 💡 Future Enhancements

- 📊 Interactive dashboard (Next.js + Supabase Auth)
- 🔔 Auto-reminders for upcoming events
- 📷 Image gallery with event filters
- 🧾 Certificate generator for participants

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### 📚 Contribution Guidelines
- Use Conventional Commits
- Keep code modular
- Maintain clear documentation and type safety

---

## 📄 License

MIT License © 2025 [Sourav Kumar](https://github.com/itzsouravkumar)

---

## 🙋‍♂️ Maintainer

> Built with 💙 by Sourav Kumar  
> Cybersecurity Student, SRMIST | Discord Dev 

[LinkedIn](https://linkedin.com/in/itzsouravkumar) • [GitHub](https://github.com/itzsouravkumar)
