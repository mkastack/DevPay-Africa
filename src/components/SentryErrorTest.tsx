/**
 * Sentry Error Testing Component
 * Use this component to test Sentry error tracking in development
 */

import { Button } from "@/components/ui/button";

export function SentryErrorTest() {
  const handleThrowError = () => {
    throw new Error("This is a test error from Sentry error tracking!");
  };

  return (
    <Button onClick={handleThrowError} variant="destructive" size="sm">
      🔥 Test Sentry Error
    </Button>
  );
}

export default SentryErrorTest;
