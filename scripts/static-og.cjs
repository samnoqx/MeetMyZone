const fs = require('node:fs/promises');
const React = require('react');
const { ImageResponse } = require('next/og');
(async () => {
  const image = new ImageResponse(React.createElement('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: 80, background: '#030712', color: 'white', fontFamily: 'sans-serif' } },
    React.createElement('div', {style: {fontSize: 76, color: '#38bdf8'}}, 'MeetMyZone'),
    React.createElement('div', {style: {fontSize: 38, marginTop: 30}}, 'Find a meeting time across the world'),
    React.createElement('div', {style: {fontSize: 24, marginTop: 30}}, 'Compare cities • Plan meetings • Share schedules')
  ), { width: 1200, height: 630 });
  await fs.writeFile('public/og-default.png', Buffer.from(await image.arrayBuffer()));
})().catch(error => { console.error(error); process.exitCode = 1; });
