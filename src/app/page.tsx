// app/page.tsx
'use client';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SpeedSample {
  time: string;
  download: number;
  upload: number;
}

export default function SpeedTest() {
  const [download, setDownload] = useState('--');
  const [upload, setUpload] = useState('--');
  const [ping, setPing] = useState('--');
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<SpeedSample[]>([]);

  const runTest = async () => {
    setLoading(true);
    setGraphData([]);
    setDownload('...');
    setUpload('...');
    setPing('...');

    const interval = 100;
    const duration = 3000;
    const samples = Math.floor(duration / interval);
    const downloadSamples: number[] = [];
    const uploadSamples: number[] = [];

    for (let i = 0; i < samples; i++) {
      try {
        const d = await testDownload();
        const u = await testUpload();
        downloadSamples.push(+d);
        uploadSamples.push(+u);
        setGraphData((prev) => [...prev, { time: `${i}s`, download: +d, upload: +u }]);
      } catch (error) {
        console.error('Speed test error:', error);
      }
    }

    const avgDownload = (
      downloadSamples.reduce((a, b) => a + b, 0) / downloadSamples.length || 0
    ).toFixed(2);
    const avgUpload = (
      uploadSamples.reduce((a, b) => a + b, 0) / uploadSamples.length || 0
    ).toFixed(2);

    setDownload(`${avgDownload} Mbps`);
    setUpload(`${avgUpload} Mbps`);

    try {
      const p = await testPing();
      setPing(`${p} ms`);
    } catch (error) {
      console.error('Ping test error:', error);
      setPing('Error');
    }

    setLoading(false);
  };

  const testDownload = async () => {
    const start = performance.now();
    const res = await fetch('/api/download');
    const blob = await res.blob();
    const time = (performance.now() - start) / 1000;
    const bits = blob.size * 8;
    return (bits / time / (1024 * 1024)).toFixed(2);
  };

  const testUpload = async () => {
    const data = new Blob([new ArrayBuffer(1 * 1024 * 1024)]); // 1MB
    const start = performance.now();
    await fetch('/api/upload', { method: 'POST', body: data });
    const time = (performance.now() - start) / 1000;
    const bits = data.size * 8;
    return (bits / time / (1024 * 1024)).toFixed(2);
  };

  const testPing = async () => {
    const start = performance.now();
    await fetch('/api/ping');
    return Math.round(performance.now() - start);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-[var(--background)] text-[var(--text-primary)]">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">Internet Speed Meter</h1>

      <div className="grid gap-4 w-full max-w-md">
        <div className="card text-xl">Download: <strong>{download}</strong></div>
        <div className="card text-xl">Upload: <strong>{upload}</strong></div>
        <div className="card text-xl">Ping: <strong>{ping}</strong></div>
      </div>

      <button
        onClick={runTest}
        className="button-primary mt-6 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Testing (3s)...' : 'Start Test'}
      </button>

      <div className="w-full max-w-3xl mt-12 rounded-2xl overflow-hidden">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={graphData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={"var(--border-color)"} />
            <XAxis dataKey="time" stroke={"var(--text-muted)"} />
            <YAxis domain={[0, 'auto']} stroke={"var(--text-muted)"} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="download" stroke="#3b82f6" name="Download (Mbps)" />
            <Line type="monotone" dataKey="upload" stroke="#10b981" name="Upload (Mbps)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
