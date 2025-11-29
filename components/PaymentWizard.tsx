'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Upload, CreditCard, CheckCircle, Smartphone } from 'lucide-react'
import { submitPayment } from '@/app/actions/enroll'
import Image from 'next/image' // <--- Added for preview

// --- CONFIGURATION: Bank Details ---
const PAYMENT_METHODS = [
    {
        id: 'kpay',
        name: 'KBZ Pay',
        icon: <Smartphone className="text-blue-500" />,
        color: 'border-blue-500/50 hover:bg-blue-500/10',
        accountName: 'Ma Yee Mon',
        accountNum: '099-762-83570',
        qrPlaceholder: 'bg-blue-600'
    },
    {
        id: 'aya',
        name: 'AYA Pay',
        icon: <CreditCard className="text-red-500" />,
        color: 'border-red-500/50 hover:bg-red-500/10',
        accountName: 'Ma Yee Mon',
        accountNum: '200-123-45678',
        qrPlaceholder: 'bg-red-600'
    },
    {
        id: 'cb',
        name: 'CB Pay',
        icon: <CreditCard className="text-orange-500" />,
        color: 'border-orange-500/50 hover:bg-orange-500/10',
        accountName: 'Ma Yee Mon',
        accountNum: '001-112-23344',
        qrPlaceholder: 'bg-orange-600'
    }
]

export default function PaymentWizard({ eventId }: { eventId: string }) {
    const [step, setStep] = useState(1)
    const [selectedBank, setSelectedBank] = useState<typeof PAYMENT_METHODS[0] | null>(null)
    const [direction, setDirection] = useState(1)

    // --- NEW: Image Preview State ---
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    const nextStep = () => {
        setDirection(1)
        setStep((prev) => prev + 1)
    }

    const prevStep = () => {
        setDirection(-1)
        setStep((prev) => prev - 1)
    }

    const handleBankSelect = (bank: typeof PAYMENT_METHODS[0]) => {
        setSelectedBank(bank)
        nextStep()
    }

    // --- NEW: Handle File Selection ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Create a fake local URL just for preview
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            setFileName(file.name)
        }
    }

    // Animation Variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    }

    return (
        <div className="w-full max-w-md mx-auto">

            {/* 1. Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className={step >= 1 ? 'text-blue-400' : ''}>Method</span>
                    <span className={step >= 2 ? 'text-blue-400' : ''}>Transfer</span>
                    <span className={step >= 3 ? 'text-blue-400' : ''}>Confirm</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: '33%' }}
                        animate={{ width: `${step * 33.33}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* 2. Dynamic Container */}
            <motion.div
                layout
                className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative"
                style={{ minHeight: '300px' }}
            >
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>

                    {/* STEP 1: CHOOSE BANK */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="p-8 w-full"
                        >
                            <h2 className="text-xl font-bold text-white mb-6">Select Payment Method</h2>
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map((bank) => (
                                    <button
                                        key={bank.id}
                                        onClick={() => handleBankSelect(bank)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-900/50 transition-all ${bank.color}`}
                                    >
                                        <div className="bg-slate-800 p-2 rounded-lg">{bank.icon}</div>
                                        <span className="font-semibold text-slate-200">{bank.name}</span>
                                        <ChevronLeft className="ml-auto rotate-180 text-slate-500" size={20} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BANK DETAILS */}
                    {step === 2 && selectedBank && (
                        <motion.div
                            key="step2"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="p-8 w-full"
                        >
                            <button onClick={prevStep} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-4">
                                <ChevronLeft size={16} /> Back
                            </button>

                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                Transfer to {selectedBank.name}
                            </h2>

                            <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center text-center border border-slate-700 mb-6">
                                <div className={`w-40 h-40 rounded-lg mb-4 ${selectedBank.qrPlaceholder} flex items-center justify-center`}>
                                    <span className="text-white/50 font-mono text-xs">QR CODE</span>
                                </div>

                                <p className="text-slate-400 text-sm mb-1">Account Name</p>
                                <p className="text-white font-bold text-lg mb-4">{selectedBank.accountName}</p>

                                <p className="text-slate-400 text-sm mb-1">Account Number</p>
                                <p className="font-mono text-blue-400 text-xl tracking-widest">{selectedBank.accountNum}</p>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                I have transferred <CheckCircle size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: UPLOAD PROOF */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="p-8 w-full"
                        >
                            <button onClick={prevStep} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-4">
                                <ChevronLeft size={16} /> Back to Details
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2">Upload Receipt</h2>
                            <p className="text-slate-400 text-sm mb-6">Please upload the screenshot of your transaction.</p>

                            <form action={submitPayment} className="flex flex-col gap-4">
                                <input type="hidden" name="eventId" value={eventId} />
                                <input type="hidden" name="userId" value="1" />

                                {/* --- PREVIEW SECTION --- */}
                                <div className="border-2 border-dashed border-slate-600 rounded-xl p-2 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-500/5 transition-all group cursor-pointer relative overflow-hidden min-h-[200px]">

                                    <input
                                        name="screenshot"
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={handleFileChange} // Updates the preview
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />

                                    {/* Conditional Render: Preview OR Placeholder */}
                                    {previewUrl ? (
                                        <div className="relative w-full h-full flex flex-col items-center z-10">
                                            <div className="relative w-48 h-48 mb-2">
                                                <Image
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    fill
                                                    className="object-contain rounded-lg"
                                                />
                                            </div>
                                            <p className="text-xs text-green-400 font-medium">{fileName}</p>
                                            <p className="text-xs text-slate-500">Click to change</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <div className="bg-slate-800 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="text-blue-400" size={24} />
                                            </div>
                                            <p className="text-sm text-slate-300 font-medium">Click to browse</p>
                                            <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 5MB</p>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="mt-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors">
                                    Confirm & Submit
                                </button>
                            </form>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div>
        </div>
    )
}