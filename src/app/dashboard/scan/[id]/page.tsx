"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import {
    AlertCircle,
    Calendar,
    Check,
    FileText,
    History,
    Info,
    MapPin,
    QrCode,
    RotateCcw,
    Search,
    Ticket,
    Users,
    X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"

import type { EventDetails } from "@/@types"
import { initDB, saveScannedTicket, getRecentScans } from "@/lib/indexdb"
import EventService from "@/actions/events"
import ScanTicketService from "@/actions/scan"

// Define recent scan type
interface RecentScan {
    id: string
    type: string
    holder: string
    status: "valid" | "used" | "invalid"
    timestamp: string
    scannedBy: string
    reason?: string
}

export default function ScanTicketsForEvent() {
    const params = useParams()
    const eventId = params.id as string

    const [scanMode, setScanMode] = useState("camera")
    const [scanning, setScanning] = useState(false)
    const [ticketInput, setTicketInput] = useState("")
    const [scanResult, setScanResult] = useState<null | { success: boolean; ticket?: any; message: string }>(null)
    const [recentScans, setRecentScans] = useState<RecentScan[]>([])
    const [showScanner, setShowScanner] = useState(false)
    const [staffName, setStaffName] = useState("Staff")
    const [eventData, setEventData] = useState<EventDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const scannerIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const qrScannerRef = useRef<any>(null)

    // Initialize IndexedDB and load recent scans
    useEffect(() => {
        const initialize = async () => {
            await initDB()
            const storedScans = await getRecentScans()
            setRecentScans(storedScans)
        }
        initialize()
    }, [])

    // Fetch event data
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true)
                const data = await EventService.getById(eventId)
                setEventData(data)
            } catch (error) {
                setError("Failed to load event data")
                console.error("Error fetching event data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (eventId) {
            fetchEventData()
        }
    }, [eventId])

    // Calculate percentage of tickets scanned
    const scannedPercentage = eventData
        ? Math.round((eventData.sales.ticketsScanned / eventData.sales.totalTicketSupply) * 100)
        : 0

    // Format event date
    const eventDate = eventData ? new Date(eventData.date) : new Date()
    const formattedEventDate = format(eventDate, "MMMM d, yyyy")
    const formattedEventTime = format(eventDate, "h:mm a")

    // Initialize QR Scanner when camera mode is active and show scanner is true
    useEffect(() => {
        if (scanMode === "camera" && showScanner) {
            // Import the library dynamically to avoid SSR issues
            import("html5-qrcode")
                .then(({ Html5Qrcode }) => {
                    if (!qrScannerRef.current && videoRef.current) {
                        qrScannerRef.current = new Html5Qrcode("qr-reader")

                        const config = { fps: 10, qrbox: { width: 250, height: 250 } }

                        if (scanning) {
                            qrScannerRef.current.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
                        }
                    }
                })
                .catch((err) => {
                    console.error("Error loading QR scanner library:", err)
                })
        }

        return () => {
            if (qrScannerRef.current && qrScannerRef.current.isScanning) {
                qrScannerRef.current.stop().catch((err: any) => {
                    console.error("Error stopping scanner:", err)
                })
            }
        }
    }, [scanMode, showScanner, scanning])

    // Function to handle successful QR scan
    const onScanSuccess = async (decodedText: string) => {
        if (!scanning) return

        // Stop scanning temporarily to process the result
        if (qrScannerRef.current && qrScannerRef.current.isScanning) {
            await qrScannerRef.current.pause()
        }

        setTicketInput(decodedText)
        validateTicket(decodedText)
    }

    // Function to handle QR scan failure
    const onScanFailure = (error: any) => {
        // Just log the error, don't need to show to user for camera failures
        console.warn(`QR scan error: ${error}`)
    }

    // Handle manual ticket submission
    const handleSubmitTicket = () => {
        if (!ticketInput) return
        validateTicket(ticketInput)
    }

    // Validate ticket via API
    const validateTicket = async (value: string) => {
        setScanning(true)
        setScanResult(null)

        try {
            // Use keyWord parameter for camera mode, ticketNumber for manual mode
            const params = scanMode === "manual" ? { ticketNumber: value, eventId: eventId } : 
            { keyWord: value, eventId: eventId }

            const result = await ScanTicketService.scanTicket(params) 

            const success = result.success
            const message = success ? "Ticket valid" : "Ticket already scanned"

            setScanResult({
                success,
                message,
                ticket: result.ticket,
            })
            // Create scan record and save to IndexedDB
            const ticketType = result.ticket.ticketType.name
            const holder = result.ticket.issuedTo.name || "Unknown"

            const newScan: RecentScan = {
                id: result.ticket.ticketNumber,
                type: ticketType,
                holder: holder,
                status: success ? "valid" : "used",
                timestamp: new Date().toISOString(),
                scannedBy: staffName,
                reason: !success ? message : undefined,
            }

            // Save to IndexedDB
            await saveScannedTicket(newScan)

            // Update local state
            const updatedScans = await getRecentScans()
            setRecentScans(updatedScans)
        } catch (error) {
            console.error("Error validating ticket:", error)

            setScanResult({
                success: false,
                message: "Error validating ticket",
            })

            // Save invalid scan to IndexedDB
            const newScan: RecentScan = {
                id: value,
                type: "Unknown",
                holder: "Unknown",
                status: "invalid",
                timestamp: new Date().toISOString(),
                scannedBy: staffName,
                reason: "Error validating ticket",
            }

            await saveScannedTicket(newScan)
            const updatedScans = await getRecentScans()
            setRecentScans(updatedScans)
        } finally {
            setScanning(false)

            // Resume scanning after a delay if in camera mode
            if (scanMode === "camera" && qrScannerRef.current) {
                setTimeout(() => {
                    if (scanning && qrScannerRef.current) {
                        qrScannerRef.current.resume()
                    }
                }, 3000)
            }
        }
    }

    // Toggle camera scanning
    const toggleScanning = () => {
        if (scanning) {
            // Stop scanning
            setScanning(false)
            setScanResult(null)

            if (qrScannerRef.current && qrScannerRef.current.isScanning) {
                qrScannerRef.current.stop().catch((err: any) => {
                    console.error("Error stopping scanner:", err)
                })
            }
        } else {
            // Start scanning
            setScanning(true)
            setScanResult(null)
            setTicketInput("")

            if (qrScannerRef.current) {
                const config = { fps: 10, qrbox: { width: 250, height: 250 } }
                qrScannerRef.current.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            }
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto p-2 sm:p-4 flex items-center justify-center h-screen">
                <div className="text-center">
                    <RotateCcw className="h-8 w-8 sm:h-10 sm:w-10 animate-spin mx-auto mb-3 sm:mb-4 text-primary" />
                    <p className="text-lg sm:text-xl">Loading event data...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !eventData) {
        return (
            <div className="container mx-auto p-2 sm:p-4 flex items-center justify-center h-screen">
                <div className="text-center">
                    <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-destructive" />
                    <p className="text-lg sm:text-xl mb-2">Error loading event</p>
                    <p className="text-sm text-muted-foreground">{error || "Event data not found"}</p>
                    <Button className="mt-4" size="sm" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-2 sm:gap-4 bg-background px-3 sm:px-4 py-3 sm:py-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">{eventData.name}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">Ticket Scanner</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Left column - Scanner */}
                <div className="md:col-span-2 space-y-4 sm:space-y-6">
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-muted/50 p-3 sm:p-6">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base sm:text-lg">Ticket Scanner</CardTitle>
                                <div className="flex gap-1 sm:gap-2">
                                    <Button
                                        variant={scanMode === "camera" ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 text-xs sm:text-sm px-2 sm:px-3"
                                        onClick={() => setScanMode("camera")}
                                    >
                                        <QrCode className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="hidden xs:inline">Camera</span>
                                        <span className="xs:hidden">Camera</span>
                                    </Button>
                                    <Button
                                        variant={scanMode === "manual" ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 text-xs sm:text-sm px-2 sm:px-3"
                                        onClick={() => setScanMode("manual")}
                                    >
                                        <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="hidden xs:inline">Manual</span>
                                        <span className="xs:hidden">Manual</span>
                                    </Button>
                                </div>
                            </div>
                            <CardDescription className="text-xs sm:text-sm mt-1">
                                {scanMode === "camera" ? "Scan ticket QR codes using your camera" : "Enter ticket ID manually"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {scanMode === "camera" ? (
                                <div className="relative">
                                    {/* Camera view / QR scanner */}
                                    <div className="aspect-video bg-black relative overflow-hidden">
                                        {showScanner ? (
                                            <div id="qr-reader" className="w-full h-full"></div>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center p-4 sm:p-6">
                                                    <QrCode className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                                                    <p className="text-xs sm:text-sm text-muted-foreground">Camera preview will appear here</p>
                                                    <Button
                                                        className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9"
                                                        onClick={() => setShowScanner(true)}
                                                    >
                                                        Enable Camera
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Scan result overlay */}
                                        {scanResult && (
                                            <div
                                                className={`absolute inset-0 flex items-center justify-center bg-opacity-90 ${scanResult.success ? "bg-green-900" : "bg-red-900"}`}
                                            >
                                                <div className="text-center p-4 sm:p-6 max-w-md">
                                                    <div
                                                        className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center ${scanResult.success ? "bg-green-500" : "bg-red-500"}`}
                                                    >
                                                        {scanResult.success ? (
                                                            <Check className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                                        ) : (
                                                            <X className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                                        {scanResult.success ? "Valid Ticket" : "Invalid Ticket"}
                                                    </h3>
                                                    <p className="text-sm sm:text-base text-white mb-3 sm:mb-4">{scanResult.message}</p>

                                                    {scanResult.ticket && (
                                                        <div className="bg-white/10 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-left">
                                                            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-white text-xs sm:text-sm">
                                                                <p className="text-white/70">Ticket ID:</p>
                                                                <p className="font-medium">{scanResult.ticket.ticketNumber}</p>
                                                                <p className="text-white/70">Type:</p>
                                                                <p className="font-medium">{scanResult.ticket.ticketType.name}</p>
                                                                <p className="text-white/70">Name:</p>
                                                                <p className="font-medium">{scanResult.ticket.issuedTo.name}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2 justify-center">
                                                        <Button
                                                            variant={scanResult.success ? "default" : "destructive"}
                                                            size="sm"
                                                            className="text-xs sm:text-sm h-8 sm:h-9"
                                                            onClick={() => {
                                                                setScanResult(null)
                                                                setTicketInput("")
                                                            }}
                                                        >
                                                            {scanResult.success ? "Continue" : "Dismiss"}
                                                        </Button>

                                                        {!scanResult.success && scanResult.ticket && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-xs sm:text-sm h-8 sm:h-9 bg-white/10 text-white border-white/30 hover:bg-white/20"
                                                            >
                                                                Override
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 sm:p-6">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter ticket ID or scan code"
                                                value={ticketInput}
                                                onChange={(e) => setTicketInput(e.target.value)}
                                                disabled={scanning}
                                                className="text-xs sm:text-sm h-8 sm:h-10"
                                            />
                                            <Button
                                                onClick={handleSubmitTicket}
                                                disabled={scanning || !ticketInput.trim()}
                                                size="sm"
                                                className="h-8 sm:h-10 whitespace-nowrap text-xs sm:text-sm"
                                            >
                                                {scanning ? (
                                                    <>
                                                        <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                                        <span className="hidden xs:inline">Checking</span>
                                                        <span className="xs:hidden">...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="hidden xs:inline">Validate</span>
                                                        <span className="xs:hidden">Check</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Manual entry result */}
                                        {scanResult && (
                                            <div
                                                className={`p-3 sm:p-4 rounded-lg ${scanResult.success ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900" : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900"}`}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <div
                                                        className={`rounded-full p-1 ${scanResult.success ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"}`}
                                                    >
                                                        {scanResult.success ? (
                                                            <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        ) : (
                                                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3
                                                            className={`text-sm sm:text-base font-medium ${scanResult.success ? "text-green-800 dark:text-green-400" : "text-red-800 dark:text-red-400"}`}
                                                        >
                                                            {scanResult.success ? "Valid Ticket" : "Invalid Ticket"}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground">{scanResult.message}</p>

                                                        {scanResult.ticket && (
                                                            <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 text-xs sm:text-sm">
                                                                <p className="text-muted-foreground">Ticket ID:</p>
                                                                <p className="font-medium truncate">{scanResult.ticket.ticketNumber}</p>
                                                                <p className="text-muted-foreground">Type:</p>
                                                                <p className="font-medium truncate">{scanResult.ticket.ticketType.name}</p>
                                                                <p className="text-muted-foreground">Name:</p>
                                                                <p className="font-medium truncate">{scanResult.ticket.issuedTo.name}</p>
                                                            </div>
                                                        )}

                                                        <div className="mt-2 sm:mt-3 flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                                                                variant={scanResult.success ? "default" : "destructive"}
                                                                onClick={() => {
                                                                    setScanResult(null)
                                                                    setTicketInput("")
                                                                }}
                                                            >
                                                                {scanResult.success ? "Continue" : "Dismiss"}
                                                            </Button>

                                                            {!scanResult.success && scanResult.ticket && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                                                                >
                                                                    Override
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                            <Info className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                            <p>Enter the ticket ID or QR code data</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="bg-muted/50 flex justify-between p-3 sm:p-6 flex-wrap gap-2">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                {scanMode === "camera" ? (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span>Position QR code within frame</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span>Enter full ticket ID</span>
                                    </div>
                                )}
                            </div>
                            {scanMode === "camera" && showScanner && (
                                <Button
                                    variant={scanning ? "destructive" : "default"}
                                    size="sm"
                                    className="h-8 text-xs sm:text-sm whitespace-nowrap"
                                    onClick={toggleScanning}
                                >
                                    {scanning ? (
                                        <>
                                            <X className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden xs:inline">Stop Scanning</span>
                                            <span className="xs:hidden">Stop</span>
                                        </>
                                    ) : (
                                        <>
                                            <QrCode className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden xs:inline">Start Scanning</span>
                                            <span className="xs:hidden">Start</span>
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Recent scans */}
                    <Card>
                        <CardHeader className="p-3 sm:p-6">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base sm:text-lg">Recent Scans</CardTitle>
                                <Button variant="outline" size="sm" className="h-7 sm:h-8 text-xs sm:text-sm">
                                    <History className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden xs:inline">View All</span>
                                    <span className="xs:hidden">All</span>
                                </Button>
                            </div>
                            <CardDescription className="text-xs sm:text-sm mt-1">
                                Last {recentScans.length} tickets scanned
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                            <div className="space-y-3 sm:space-y-4">
                                {recentScans.length === 0 ? (
                                    <div className="text-center py-6 sm:py-8">
                                        <History className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2 sm:mb-3" />
                                        <p className="text-xs sm:text-sm text-muted-foreground">No recent scans</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3">
                                        {recentScans.map((scan, index) => (
                                            <div
                                                key={`${scan.id}-${index}`}
                                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border text-xs sm:text-sm"
                                            >
                                                <div
                                                    className={`rounded-full p-1 flex-shrink-0 ${scan.status === "valid"
                                                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                            : scan.status === "used"
                                                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                        }`}
                                                >
                                                    {scan.status === "valid" ? (
                                                        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    ) : scan.status === "used" ? (
                                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    ) : (
                                                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start flex-wrap gap-1">
                                                        <div className="min-w-0 max-w-full">
                                                            <p className="font-medium truncate">{scan.holder}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{scan.id}</p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                scan.status === "valid" ? "default" : scan.status === "used" ? "outline" : "destructive"
                                                            }
                                                            className="text-[10px] sm:text-xs px-1 sm:px-2 h-5 sm:h-6"
                                                        >
                                                            {scan.status === "valid" ? "Valid" : scan.status === "used" ? "Used" : "Invalid"}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1 flex-wrap gap-1">
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                                                            {scan.type} • {scan.scannedBy}
                                                        </p>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                                                            {format(new Date(scan.timestamp), "h:mm a")}
                                                        </p>
                                                    </div>
                                                    {scan.reason && <p className="text-[10px] sm:text-xs text-red-500 mt-1">{scan.reason}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column - Event info and stats */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Event info */}
                    <Card>
                        <CardHeader className="p-3 sm:p-6">
                            <CardTitle className="text-base sm:text-lg">Event Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-medium">{eventData.name}</h3>
                                    <p className="text-xs text-muted-foreground">ID: {eventData._id}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium">{formattedEventDate}</p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">{formattedEventTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium">{eventData.location}</p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">Venue</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanning stats */}
                    <Card>
                        <CardHeader className="p-3 sm:p-6">
                            <CardTitle className="text-base sm:text-lg">Scanning Stats</CardTitle>
                            <CardDescription className="text-xs sm:text-sm mt-1">
                                Track check-in progress for the event
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
                            <div>
                                <div className="flex justify-between mb-1 sm:mb-2">
                                    <span className="text-xs sm:text-sm font-medium">Tickets Scanned</span>
                                    <span className="text-xs sm:text-sm font-medium">
                                        {eventData.sales.ticketsScanned} / {eventData.sales.ticketsSold}
                                    </span>
                                </div>
                                <Progress value={scannedPercentage} className="h-1.5 sm:h-2" />
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                                    {scannedPercentage}% of tickets scanned
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <Card>
                                    <CardContent className="p-3 sm:p-4">
                                        <div className="flex flex-col items-center">
                                            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-1 sm:mb-2" />
                                            <p className="text-lg sm:text-2xl font-bold">{eventData.sales.ticketsScanned}</p>
                                            <p className="text-[10px] sm:text-sm text-muted-foreground">Checked In</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-3 sm:p-4">
                                        <div className="flex flex-col items-center">
                                            <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-1 sm:mb-2" />
                                            <p className="text-lg sm:text-2xl font-bold">
                                                {eventData.sales.totalTicketSupply - eventData.sales.ticketsScanned}
                                            </p>
                                            <p className="text-[10px] sm:text-sm text-muted-foreground">Remaining</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

