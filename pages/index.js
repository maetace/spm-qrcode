import { useEffect, useState } from 'react';

export default function Home() {
  const [localIP, setLocalIP] = useState('Detecting...');

  useEffect(() => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));

    pc.onicecandidate = (event) => {
      if (!event?.candidate) return;
      const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
      const ipMatch = event.candidate.candidate.match(ipRegex);
      if (ipMatch) {
        setLocalIP(ipMatch[1]);
        pc.close();
      }
    };
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '4rem' }}>
      <h1>📡 Local IP Address</h1>
      <p style={{ fontSize: '2rem', color: '#0070f3' }}>{localIP}</p>
    </main>
  );
}