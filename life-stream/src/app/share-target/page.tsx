import { redirect } from 'next/navigation';

export default async function ShareTargetPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const title = resolvedParams['title'] as string || '';
    const text = resolvedParams['text'] as string || '';
    const url = resolvedParams['url'] as string || '';

    const combined = [title, text, url].filter(Boolean).join(' ');

    if (combined) {
        // Redirect to home with auto-analysis enabled
        redirect(`/?mode=thought&content=${encodeURIComponent(combined)}`);
    }

    redirect('/');
}
