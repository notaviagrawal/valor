import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';
import { MiniKitTest } from '../components/MiniKitTest';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center space-y-8">
        <MiniKitTest />
        <AuthButton />
      </Page.Main>
    </Page>
  );
}
