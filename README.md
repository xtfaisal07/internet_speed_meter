# 🌐 Internet Speed Meter

A real-time internet speed test web app built with **Next.js**, **Tailwind CSS**, and **Recharts**, featuring:

- 📥 Real-time Download Speed Graph
- 📤 Real-time Upload Speed Graph
- 📶 Ping Measurement
- 📊 Live Chart with 10s Monitoring
- ☁️ Deployable on Vercel

---

## 📸 Demo

https://internetspeedmeter.vercel.app/

---

<img width="1440" alt="Screenshot 2025-07-07 at 2 47 08 AM" src="https://github.com/user-attachments/assets/f39ca7fd-26f4-4bb5-a50d-7471f4063b10" />


---

## 🚀 Features

- Realtime speed sampling every second for 10 seconds
- Displays average upload/download speeds after test
- Beautiful charts using [Recharts](https://recharts.org/)
- Responsive layout styled with Tailwind CSS

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Graphing**: Recharts
- **Backend APIs**: Node.js (via Next.js API routes)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/xtfaisal07/internet_speed_meter.git
cd internet-speed-meter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🧩 Folder Structure

```
app/
├── page.tsx        # Main UI and graph logic
├── api/
│   ├── download/   # Sends 5MB dummy buffer
│   ├── upload/     # Accepts 1MB payload
│   └── ping/       # Returns simple ping response
public/
├── demo.jpeg
```

---

## 🧪 How It Works

- Every second, download/upload tests are performed using blob buffers.
- Data is collected for 10 seconds and plotted using Recharts.
- Ping is calculated using a simple GET request.
- Final average speeds are computed and displayed.

---

## 📡 Deployment

1. Push your code to GitHub:

```bash
git remote add origin https://github.com/xtfaisal07/internet_speed_meter.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Import your repo → Select Next.js → Deploy 🎉

---

## 📚 Dependencies

```bash
npm install recharts
```

(Tailwind is included if you selected it during `create-next-app`)

---

## 📄 License

MIT License

---

## ✨ Credits

Inspired by [Fast.com](https://fast.com), built for learning and testing purposes.

---

## 🙋‍♂️ Feedback

Feel free to open issues or PRs for improvements!

---

© 2025 Faisal Naseer. All rights reserved.

