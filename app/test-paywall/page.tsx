import Paywall from '@/components/Paywall';

export default function TestPaywallPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-6">🧪 Test Paywall Page</h1>
        <p className="text-xl mb-10">This is a protected page for testing.</p>
        <Paywall />
      </div>
    </div>
  );
}