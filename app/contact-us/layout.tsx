import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | MeetMyZone",
  description: "Get in touch with the MeetMyZone developer for support, feature requests, or developer collaborations.",
  alternates: {
    canonical: "https://meetmyzone.com/contact-us"
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
