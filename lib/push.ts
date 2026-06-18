// lib/push.ts
// Native push-notification registration for the Capacitor Android app.
// Safe to import anywhere: every native call is dynamically imported and
// guarded, so on the plain web build (no Capacitor) it simply no-ops.

import { supabase } from '@/lib/supabase';

let _registered = false;

/** True only inside the native Capacitor shell (the installed Android app). */
function isNative(): boolean {
  try {
    // Capacitor injects window.Capacitor in the native WebView.
    const cap = (window as any)?.Capacitor;
    return !!cap?.isNativePlatform?.();
  } catch {
    return false;
  }
}

/**
 * Registers the device for push notifications and stores the FCM token
 * against the logged-in user. Call this AFTER the user is authenticated.
 * No-ops on web, on repeat calls, or if anything is unavailable.
 */
export async function registerPush(userId: string): Promise<void> {
  if (_registered) return;
  if (!isNative()) return;          // web build — nothing to do
  if (!userId) return;

  let PushNotifications: any;
  try {
    // Dynamic import so the web bundle never tries to resolve the native plugin.
    ({ PushNotifications } = await import('@capacitor/push-notifications'));
  } catch {
    return; // plugin not present (web) — silently skip
  }

  try {
    // Ask permission (Android 13+ requires the runtime prompt).
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') return;

    // Kick off FCM registration.
    await PushNotifications.register();

    // Fires once FCM hands back a device token.
    PushNotifications.addListener('registration', async (token: { value: string }) => {
      try {
        await supabase.from('push_tokens').upsert(
          {
            user_id: userId,
            token: token.value,
            platform: 'android',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'token' }
        );
      } catch {
        /* storing the token failed — non-fatal */
      }
    });

    PushNotifications.addListener('registrationError', () => {
      /* registration failed — non-fatal, will retry next launch */
    });

    // Foreground notifications: optional handling if you want in-app display.
    PushNotifications.addListener('pushNotificationReceived', () => {
      /* no-op: Android shows it in the tray automatically */
    });

    _registered = true;
  } catch {
    /* any failure here must never crash the app */
  }
}
