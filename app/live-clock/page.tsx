import RuntimeTimePage from '@/components/RuntimeTimePage';
export const metadata = { robots: { index: false, follow: true } };
export default function Page() { return <RuntimeTimePage kind="clock" />; }
