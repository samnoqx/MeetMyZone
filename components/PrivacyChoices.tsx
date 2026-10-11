'use client';

import { useEffect, useState } from 'react';

type ConsentData = { gdprApplies?: boolean; listenerId?: number };
type GoogleConsent = {
  callbackQueue: Array<{ CONSENT_API_READY: () => void }>;
  showRevocationMessage?: () => void;
};
type ConsentWindow = Window & {
  googlefc?: GoogleConsent;
  __tcfapi?: (command: string, version: number, callback: (data: ConsentData, success: boolean) => void, listenerId?: number) => void;
};

export default function PrivacyChoices() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const target = window as ConsentWindow;
    const consent = target.googlefc ??= { callbackQueue: [] };
    consent.callbackQueue ??= [];
    let active = true;
    let listenerId: number | undefined;
    consent.callbackQueue.push({ CONSENT_API_READY: () => {
      if (!active) return;
      target.__tcfapi?.('addEventListener', 2, (data, success) => {
        listenerId = data?.listenerId;
        if (active && success) setAvailable(data.gdprApplies === true);
      });
    } });
    return () => {
      active = false;
      if (listenerId !== undefined) target.__tcfapi?.('removeEventListener', 2, () => {}, listenerId);
    };
  }, []);
  if (!available) return null;
  return <button type="button" className="text-left text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium"
    onClick={() => {
      const consent = (window as ConsentWindow).googlefc;
      consent?.callbackQueue.push({ CONSENT_API_READY: () => consent.showRevocationMessage?.() });
    }}>Privacy and cookie settings</button>;
}
