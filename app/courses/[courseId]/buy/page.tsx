import PaymentWizard from '@/components/PaymentWizard'

export default async function PaymentPage({
                                              params
                                          }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            {/* Just render the Wizard and pass the ID */}
            <PaymentWizard eventId={id} />
        </main>
    )
}