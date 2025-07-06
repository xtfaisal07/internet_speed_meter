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

    const interval = 1000;
    const duration = 5000;
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-6">Internet Speed Meter</h1>

      <div className="grid gap-4 w-full max-w-md">
        <div className="p-4 bg-white rounded-2xl shadow text-xl">Download: <strong>{download}</strong></div>
        <div className="p-4 bg-white rounded-2xl shadow text-xl">Upload: <strong>{upload}</strong></div>
        <div className="p-4 bg-white rounded-2xl shadow text-xl">Ping: <strong>{ping}</strong></div>
      </div>

      <button
        onClick={runTest}
        className="bg-blue-600 text-white py-2 px-4 mt-6 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Testing (5s)...' : 'Start Test'}
      </button>

      <div className="w-full max-w-3xl mt-10">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={graphData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 'auto']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="download" stroke="#8884d8" name="Download (Mbps)" />
            <Line type="monotone" dataKey="upload" stroke="#82ca9d" name="Upload (Mbps)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
