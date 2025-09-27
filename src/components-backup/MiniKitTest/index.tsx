'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useState } from 'react';

/**
 * This component demonstrates how to check if MiniKit is installed
 * and shows different behavior based on whether the app is running
 * in World App or in a regular browser.
 */
export const MiniKitTest = () => {
  const { isInstalled } = useMiniKit();
  const [testResult, setTestResult] = useState<string>('');

  const runTest = () => {
    if (isInstalled) {
      setTestResult('✅ MiniKit is installed! This app is running in World App.');
    } else {
      setTestResult('❌ MiniKit is not installed. This app is running in a regular browser.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">MiniKit Installation Test</h2>
      
      <p className="text-sm text-gray-600 text-center">
        Click the button below to test if MiniKit is properly installed and available.
        This will return <code>true</code> only when running inside World App.
      </p>

      <Button 
        onClick={runTest}
        variant="primary"
        size="lg"
      >
        Test MiniKit.isInstalled()
      </Button>

      {testResult && (
        <div className="mt-4 p-4 rounded-md bg-gray-50 border">
          <p className="text-sm font-medium">{testResult}</p>
          <p className="text-xs text-gray-500 mt-2">
            Status: <code>MiniKit.isInstalled() = {isInstalled.toString()}</code>
          </p>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p><strong>For testing:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>In browser: Will show "not installed"</li>
          <li>In World App: Will show "installed"</li>
        </ul>
      </div>
    </div>
  );
};

