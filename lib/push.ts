// lib/push.ts
// Native push-notification registration for the Capacitor Android app.
// Safe to import anywhere: every native call is dynamically imported and
// guarded, so on the plain web build (no Capacitor) it simply no-ops.

import { supabase } from '@/lib/supabase';

let _registered = false;

/** True only inside the native Capacitor shell (the installed Android app). */
function isNative(): boolean {
  try {
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
  if (!isNative()) return;
  if (!userId) return;

  let PushNotifications: any;
  try {
    ({ PushNotifications } = await import('@capacitor/push-notifications'));
  } catch {
    return;
  }

  try {
    // Create the Android notification channel FIRST. On Android 8+ a
    // notification posted to a non-existent channel is silently dropped,
    // so the channel must exist before any notification arrives.
    try {
      await PushNotifications.createChannel({
        id: 'default',
        name: 'General',
        description: 'TerraForge notifications',
        importance: 5, // IMPORTANCE_HIGH — shows as a heads-up banner
        visibility: 1, // VISIBILITY_PUBLIC
        lights: true,
        vibration: true,
      });
    } catch {
      /* createChannel is a no-op on older Android; ignore failures */
    }

    // Check existing permission, then request if needed (Android 13+ prompt).
    let permState = await PushNotifications.checkPermissions();
    if (permState.receive === 'prompt' || permState.receive === 'prompt-with-rationale') {
      permState = await PushNotifications.requestPermissions();
    }
    if (permState.receive !== 'granted') return;

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

    PushNotifications.addListener('pushNotificationReceived', () => {
      /* foreground receipt — Android shows backgrounded ones in the tray */
    });

    _registered = true;
  } catch {
    /* any failure here must never crash the app */
  }
}
