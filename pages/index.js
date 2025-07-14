import { useEffect, useState } from 'react';

export default function Home() {
  const [localIP, setLocalIP] = useState('Detecting...');

  useEffect(() => {
    let found = false;

    const detectLocalIP = () => {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');

      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => fallbackToPublic());

      pc.onicecandidate = (event) => {
        if (!event?.candidate || found) return;
        const ipMatch = event.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
        if (ipMatch) {
          setLocalIP(ipMatch[1]);
          found = true;
          pc.close();
        }
      };
    };

    const fallbackToPublic = () => {
      fetch('https://api64.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setLocalIP(`Public: ${data.ip}`));
    };

    detectLocalIP();
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '4rem' }}>
      <h1>📡 Your IP Address</h1>
      <p style={{ fontSize: '2rem', color: '#0070f3' }}>{localIP}</p>
    </main>
  );
}