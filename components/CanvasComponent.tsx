import { useAuth } from '@/app/auth/verify/index';
import { initDraw } from '@/app/draw';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import ChatSection from './ChatSection';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Circle, Square, Pencil, MousePointer, FileImage, 
  Type, Check, X, MessageCircle, MinimizeIcon, 
  ZoomIn, ZoomOut, Move, Sparkles, Users, Download,
  Save, Share2, Grid, MonitorSmartphone, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import OnlineUsersDropdown from './OnlineUsersComponent';
import AIDrawingGenerator from './AIDrawingGenerator';

type ToolType = "select" | "circle" | "rect" | "pencil" | "image" | "text" | "pan";

// Enhanced chalk colors with more professional tones that match the landing page
const CHALK_COLORS = [
  '#ffffff', // white
  '#f9eaa9', // soft yellow
  '#a0c0ff', // blue - matches brand color
  '#ffb0d0', // soft pink
  '#ffa599', // soft salmon
  '#a0ffa0', // soft green
  '#a0ffff', // soft cyan
  '#e0a0ff', // soft lavender
  '#ffe0a0', // soft gold
  '#e0e0e0', // light gray
  '#ffbf99', // soft peach
  '#2563eb', // brand blue - matches landing page
];

const CanvasComponent = ({roomId, socket, onExit}: {roomId: string, socket: WebSocket, onExit?: () => void}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textInputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cleanupFunctionRef = useRef<(() => void) | null>(null);
    const [type, setType] = useState<ToolType>("select");
    const [showTextInput, setShowTextInput] = useState(false);
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 }); 
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [selectedColor, setSelectedColor] = useState(CHALK_COLORS[0]);
    const [fontSize, setFontSize] = useState(16);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const { userId } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState<Array<{ name: string; userId: string }>>([]);
    const [canvasInitialized, setCanvasInitialized] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [canvasObjects, setCanvasObjects] = useState<{[id: string]: unknown}>({});
    const [isMovingObject, setIsMovingObject] = useState(false);
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
    const {username} = useAuth();
    const [boardName, setBoardName] = useState("Untitled Board");
    const [showBoardInfo, setShowBoardInfo] = useState(true);

    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
    const [minZoom] = useState(0.1);
    const [maxZoom] = useState(5);
    const [showAIDrawingModal, setShowAIDrawingModal] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    const [activeTab, setActiveTab] = useState("draw");

    useEffect(() => {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'users_update') {
                    setOnlineUsers(data.users);
                } else if (data.type === 'chat_message' && !isChatVisible) {
                    setUnreadMessages(prev => prev + 1);
                } else if (data.type === 'canvas_update') {
                    try {
                        const canvasData = JSON.parse(data.message);
                        if (canvasData.id) {
                            setCanvasObjects(prev => ({
                                ...prev,
                                [canvasData.id]: canvasData
                            }));
                        }
                    } catch (err) {
                        console.error('Error parsing canvas update:', err);
                    }
                } else if (data.type === 'move_object') {
                    try {
                        const moveData = JSON.parse(data.message);
                        if (moveData.id) {
                            // Handle object movement logic
                        }
                    } catch (err) {
                        console.error('Error parsing move update:', err);
                    }
                } else if (data.type === 'board_info') {
                    if (data.name) {
                        setBoardName(data.name);
                    }
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, isChatVisible]);

    // Canvas resize handling
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;
        
        const handleResize = () => {
            if (!canvasRef.current || !containerRef.current) return;
            
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            let imageData = null;
            
            if (context && canvasInitialized) {
                imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            }
            
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            if (imageData && context) {
                context.putImageData(imageData, 0, 0);
            }
            
            setCanvasInitialized(true);
        };
        
        let resizeTimeout: NodeJS.Timeout | null = null;
        const debouncedResize = () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(handleResize, 250);
        };
        
        handleResize();
        window.addEventListener('resize', debouncedResize);
        
        return () => {
            window.removeEventListener('resize', debouncedResize);
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
        };
    }, [canvasInitialized]);

    // Canvas transformations
    const applyTransformations = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw grid if enabled
        if (showGrid) {
            const gridSize = 20;
            const offsetX = offset.x % (gridSize * scale);
            const offsetY = offset.y % (gridSize * scale);
            
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.15)';
            ctx.lineWidth = 1;
            
            for (let x = offsetX; x < ctx.canvas.width; x += gridSize * scale) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, ctx.canvas.height);
                ctx.stroke();
            }
            
            for (let y = offsetY; y < ctx.canvas.height; y += gridSize * scale) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(ctx.canvas.width, y);
                ctx.stroke();
            }
        }
        
        ctx.setTransform(
            scale, 0, 0, scale, 
            offset.x, offset.y
        );
    }, [scale, offset, showGrid]);

    // Coordinate conversion
    const screenToCanvasCoords = useCallback((screenX: number, screenY: number) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (screenX - rect.left - offset.x) / scale;
        const y = (screenY - rect.top - offset.y) / scale;
        
        return { x, y };
    }, [scale, offset]);

    // Panning handlers
    const handlePanning = useCallback((e: MouseEvent) => {
        if (!isPanning || type !== "pan") return;
        
        const dx = e.clientX - startPanPoint.x;
        const dy = e.clientY - startPanPoint.y;
        
        setOffset(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
        }));
        
        setStartPanPoint({
            x: e.clientX,
            y: e.clientY
        });
        
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                applyTransformations(ctx);
            }
        }
    }, [isPanning, type, startPanPoint, applyTransformations]);

    const startPanning = useCallback((e: MouseEvent) => {
        if (type !== "pan") return;
        
        setIsPanning(true);
        setStartPanPoint({
            x: e.clientX,
            y: e.clientY
        });
    }, [type]);

    const endPanning = useCallback(() => {
        setIsPanning(false);
    }, []);

    // Mouse event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.addEventListener('mousedown', startPanning);
        window.addEventListener('mousemove', handlePanning);
        window.addEventListener('mouseup', endPanning);
        
        return () => {
            canvas.removeEventListener('mousedown', startPanning);
            window.removeEventListener('mousemove', handlePanning);
            window.removeEventListener('mouseup', endPanning);
        };
    }, [startPanning, handlePanning, endPanning]);

    // Wheel zoom handler
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const pointXBeforeZoom = (mouseX - offset.x) / scale;
        const pointYBeforeZoom = (mouseY - offset.y) / scale;
        
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const newScale = Math.max(minZoom, Math.min(maxZoom, scale * zoomFactor));
        
        const newOffsetX = mouseX - pointXBeforeZoom * newScale;
        const newOffsetY = mouseY - pointYBeforeZoom * newScale;
        
        setScale(newScale);
        setOffset({
            x: newOffsetX,
            y: newOffsetY
        });
    }, [scale, offset, minZoom, maxZoom]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    // Apply transformations when scale/offset changes
    useEffect(() => {
        if (!canvasRef.current) return;
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            applyTransformations(ctx);
        }
    }, [scale, offset, applyTransformations]);

    // Canvas click handler for text and image placement
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const handleCanvasClick = (e: MouseEvent) => {
            if ((type === "select" && isMovingObject) || type === "pan") {
                return;
            }
            
            const canvasCoords = screenToCanvasCoords(e.clientX, e.clientY);
            
            if (type === "text") {
                setTextPosition(canvasCoords);
                setShowTextInput(true);
                setTimeout(() => {
                    if (textInputRef.current) {
                        textInputRef.current.focus();
                    }
                }, 0);
            } else if (type === "image") {
                setImagePosition(canvasCoords);
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                }
            }
        };

        if (type === "text" || type === "image") {
            canvas.addEventListener("click", handleCanvasClick);
            return () => {
                canvas.removeEventListener("click", handleCanvasClick);
            };
        }
        
        return undefined;
    }, [type, isMovingObject, screenToCanvasCoords]);
    
    // Initialize drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket || socket.readyState !== WebSocket.OPEN) return;
        
        const setupCanvas = async () => {
            if (cleanupFunctionRef.current) {
                cleanupFunctionRef.current();
                cleanupFunctionRef.current = null;
            }
            
            try {
                const cleanup = await initDraw(
                    canvas, 
                    roomId, 
                    socket, 
                    userId, 
                    type, 
                    selectedColor, 
                    (id: string) => {
                        setSelectedObjectId(id);
                        setIsMovingObject(true);
                    },
                    () => {
                        setIsMovingObject(false);
                        setSelectedObjectId(null);
                    },
                    username
                );
                cleanupFunctionRef.current = cleanup;
            } catch (error) {
                console.error("Error initializing drawing:", error);
            }
        };
        
        const timeoutId = setTimeout(() => {
            setupCanvas();
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (cleanupFunctionRef.current) {
                cleanupFunctionRef.current();
                cleanupFunctionRef.current = null;
            }
        };
    }, [roomId, socket, userId, type, selectedColor, scale, offset, screenToCanvasCoords, username]);

    // Zoom controls
    const zoomIn = () => {
        const newScale = Math.min(maxZoom, scale * 1.2);
        setScale(newScale);
        
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            const scaleDiff = newScale - scale;
            const deltaX = (centerX - offset.x) * (scaleDiff / scale);
            const deltaY = (centerY - offset.y) * (scaleDiff / scale);
            
            setOffset({
                x: offset.x - deltaX,
                y: offset.y - deltaY
            });
        }
    };
    
    const zoomOut = () => {
        const newScale = Math.max(minZoom, scale / 1.2);
        setScale(newScale);
        
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            const scaleDiff = newScale - scale;
            const deltaX = (centerX - offset.x) * (scaleDiff / scale);
            const deltaY = (centerY - offset.y) * (scaleDiff / scale);
            
            setOffset({
                x: offset.x - deltaX,
                y: offset.y - deltaY
            });
        }
    };
    
    const resetView = () => {
        setScale(1);
        setOffset({ x: 0, y: 0 });
    };

    // Text handling
    const handleTextSubmit = () => {
        if (!textInputRef.current?.value.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;
        
        const textContent = textInputRef.current.value;
        const textStyle = {
            fontSize,
            isBold,
            isItalic,
        };

        const textId = Math.random().toString(36).substr(2, 9);

        try {
            const textObject = {
                type: "text",
                x: textPosition.x,
                y: textPosition.y,
                content: textContent,
                color: selectedColor,
                style: textStyle,
                id: textId
            };

            setCanvasObjects(prev => ({
                ...prev,
                [textId]: textObject
            }));

            socket.send(JSON.stringify({
                type: "text_element",
                message: JSON.stringify(textObject),
                roomId,
                userId
            }));

            setShowTextInput(false);
            textInputRef.current.value = "";
        } catch (error) {
            console.error("Error sending text message:", error);
        }
    };

    // Image handling
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !socket || socket.readyState !== WebSocket.OPEN) return;
        
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
            console.error('Selected file is not an image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size too large. Please select an image under 5MB.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target || typeof event.target.result !== 'string') return;
            
            const imageData = event.target.result;
            const img = new Image();
            img.onload = () => {
                const maxWidth = 400;
                const maxHeight = 400;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    const ratio = maxWidth / width;
                    width = maxWidth;
                    height = height * ratio;
                }

                if (height > maxHeight) {
                    const ratio = maxHeight / height;
                    height = maxHeight;
                    width = width * ratio;
                }

                const imageId = Math.random().toString(36).substr(2, 9);
                
                const imageObject = {
                    type: "image",
                    x: imagePosition.x,
                    y: imagePosition.y,
                    width,
                    height,
                    src: imageData,
                    id: imageId
                };

                setCanvasObjects(prev => ({
                    ...prev,
                    [imageId]: imageObject
                }));
                
                try {
                    socket.send(JSON.stringify({
                        type: "image_element",
                        message: JSON.stringify(imageObject),
                        roomId,
                        userId
                    }));
                } catch (error) {
                    console.error("Error sending image message:", error);
                }
            };
            img.src = imageData;
        };
        
        reader.readAsDataURL(file);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Color picker component
    const ColorPicker = () => (
        <div className="grid grid-cols-6 gap-2 p-2">
            {CHALK_COLORS.map((color) => (
                <button
                    key={color}
                    className={cn(
                        "w-6 h-6 rounded-full border-2",
                        color === selectedColor ? "border-blue-500" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                />
            ))}
        </div>
    );

    // Tool definitions
    const tools = [
        { type: "select", icon: MousePointer, label: "Select" },
        { type: "circle", icon: Circle, label: "Circle" },
        { type: "rect", icon: Square, label: "Rectangle" },
        { type: "pencil", icon: Pencil, label: "Pencil" },
        { type: "text", icon: Type, label: "Text" },
        { type: "image", icon: FileImage, label: "Image" },
        { type: "pan", icon: Move, label: "Pan" }
    ] as const;

    // Text input handlers
    const handleTextKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowTextInput(false);
        } else if (e.key === 'Enter' && e.ctrlKey) {
            handleTextSubmit();
        }
    };
    
    // Toggle chat visibility
    const toggleChat = () => {
        setIsChatVisible(!isChatVisible);
        if (!isChatVisible) {
            setUnreadMessages(0);
        }
    };

    const isSocketConnected = socket && socket.readyState === WebSocket.OPEN;

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden">
            {/* Header bar */}
            <header className="bg-white shadow-sm px-4 py-2 border-b border-slate-200 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={onExit} 
                        className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        <span>Exit</span>
                    </Button>
                    
                    {showBoardInfo ? (
                        <div className="flex items-baseline gap-2">
                            <h1 className="font-medium text-lg text-slate-800">
                                {boardName}
                            </h1>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {roomId.substring(0, 8)}
                            </span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                            className="font-medium text-lg text-slate-800 border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent"
                            onBlur={() => setShowBoardInfo(true)}
                            autoFocus
                        />
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    <OnlineUsersDropdown users={onlineUsers} />
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72">
                            <div className="space-y-2">
                                <h3 className="font-medium">Share this board</h3>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={`sketchboard.com/board/${roomId}`}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-r-0 rounded-l-md border-slate-300 bg-slate-50 text-sm"
                                    />
                                    <Button className="rounded-l-none">Copy</Button>
                                </div>
                                <div className="pt-2">
                                    <Button variant="outline" className="w-full text-slate-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        Manage Permissions
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    
                    <Button variant="ghost" className="text-slate-600">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                    
                    <Button variant="ghost" className="text-slate-600">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </header>
            
            <div ref={containerRef} className="relative h-[calc(100vh-60px)] w-screen overflow-hidden">
                {/* Main tabs */}
                <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
                >
                    <TabsList className="bg-white border border-slate-200 shadow-sm">
                        <TabsTrigger value="draw" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                            <Pencil className="h-4 w-4 mr-2" />
                            Draw
                        </TabsTrigger>
                        <TabsTrigger value="view" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                            <MonitorSmartphone className="h-4 w-4 mr-2" />
                            Present
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                
                {/* Canvas */}
                <canvas 
                    ref={canvasRef} 
                    className="absolute top-0 left-0 w-full h-full cursor-crosshair bg-white"
                    style={{
                        cursor: type === 'pan' ? 'grab' : 
                                isPanning ? 'grabbing' : 
                                type === 'select' ? 'default' : 'crosshair'
                    }}
                />

                {/* AI Drawing Generator Modal */}
                {showAIDrawingModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <AIDrawingGenerator 
                            roomId={roomId} 
                            socket={socket} 
                            onClose={() => setShowAIDrawingModal(false)} 
                        />
                    </div>
                )}
                
                {/* Connection status indicator */}
                {!isSocketConnected && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md z-50 flex items-center gap-2 shadow-md">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Disconnected - Trying to reconnect...
                    </div>
                )}
                
                {/* Hidden file input for image uploads */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    aria-label="Upload image"
                />

                {/* Text input overlay */}
                {showTextInput && (
                    <Card className="absolute z-20 bg-white shadow-lg border border-slate-200"
                        style={{
                            left: offset.x + textPosition.x * scale,
                            top: offset.y + textPosition.y * scale,
                        }}>
                        <CardContent className="p-4">
                            <div className="flex gap-2 mb-2">
                                <select
                                    className="bg-slate-50 text-slate-800 px-2 py-1 rounded border border-slate-300"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    aria-label="Font size"
                                >
                                    {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                                        <option key={size} value={size}>{size}px</option>
                                    ))}
                                </select>
                                <Button
                                    variant={isBold ? "default" : "secondary"}
                                    size="sm"
                                    onClick={() => setIsBold(!isBold)}
                                    className={cn("font-bold", isBold ? "bg-blue-600" : "")}
                                    aria-label="Bold"
                                    aria-pressed={isBold}
                                >
                                    B
                                </Button>
                                <Button
                                    variant={isItalic ? "default" : "secondary"}
                                    size="sm"
                                    onClick={() => setIsItalic(!isItalic)}
                                    className={cn("italic", isItalic ? "bg-blue-600" : "")}
                                    aria-label="Italic"
                                    aria-pressed={isItalic}
                                >
                                    I
                                </Button>
                                <Popover>
                                   <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" style={{ backgroundColor: selectedColor }}>
                                        <span className="sr-only">Pick color</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <ColorPicker />
                                </PopoverContent>
                            </Popover>
                            </div>
                            <div className="flex gap-2">
                                <textarea
                                    ref={textInputRef}
                                    className="border border-slate-300 rounded w-64 h-24 p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter text here..."
                                    onKeyDown={handleTextKeyDown}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant="outline" onClick={() => setShowTextInput(false)} className="text-slate-600">
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                </Button>
                                <Button onClick={handleTextSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Check className="h-4 w-4 mr-1" />
                                    Add Text
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tools panel */}
                <Card className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg border border-slate-200 z-20 p-2">
                    <CardContent className="p-0 space-y-1">
                        {tools.map((tool) => (
                            <Button
                                key={tool.type}
                                variant={type === tool.type ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    type === tool.type 
                                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                                        : "text-slate-600 hover:bg-slate-100"
                                )}
                                onClick={() => setType(tool.type)}
                                title={tool.label}
                            >
                                <tool.icon className="h-5 w-5" />
                                <span className="ml-2 text-sm">{tool.label}</span>
                            </Button>
                        ))}
                        <hr className="my-2 border-slate-200" />
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-slate-600 hover:bg-slate-100"
                            onClick={() => setShowAIDrawingModal(true)}
                            title="AI Drawing Assistant"
                        >
                            <Sparkles className="h-5 w-5" />
                            <span className="ml-2 text-sm">AI Draw</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-slate-600 hover:bg-slate-100"
                            onClick={() => setShowGrid(!showGrid)}
                            title="Toggle Grid"
                        >
                            <Grid className="h-5 w-5" />
                            <span className="ml-2 text-sm">Grid</span>
                        </Button>
                    </CardContent>
                </Card>

                {/* Zoom controls */}
                <Card className="absolute right-4 bottom-4 bg-white shadow-lg border border-slate-200 z-20">
                    <CardContent className="p-1 flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={zoomOut} 
                            className="text-slate-600 hover:bg-slate-100 h-8 w-8 p-0"
                            title="Zoom Out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <div className="px-2 text-sm text-slate-600 min-w-[60px] text-center">
                            {Math.round(scale * 100)}%
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={zoomIn} 
                            className="text-slate-600 hover:bg-slate-100 h-8 w-8 p-0"
                            title="Zoom In"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={resetView} 
                            className="text-slate-600 hover:bg-slate-100 h-8 w-8 p-0"
                            title="Reset View"
                        >
                            <span className="text-xs">100%</span>
                        </Button>
                    </CardContent>
                </Card>

                {/* Colors palette */}
                <Card className="absolute left-24 top-1/2 transform -translate-y-1/2 bg-white shadow-lg border border-slate-200 z-20">
                    <CardContent className="p-2">
                        <ColorPicker />
                    </CardContent>
                </Card>

                {/* Chat toggle button */}
                <Button
                    className="absolute right-4 top-4 bg-white shadow-md border border-slate-200 hover:bg-slate-50 z-20"
                    onClick={toggleChat}
                    title="Chat"
                >
                    <MessageCircle className="h-5 w-5 text-slate-600" />
                    {unreadMessages > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadMessages}
                        </span>
                    )}
                </Button>

                {/* Chat panel */}
                {isChatVisible && (
                    <div className="absolute right-0 h-full w-80 bg-white shadow-lg border-l border-slate-200 z-10 flex flex-col">
                        <div className="p-3 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-medium text-slate-800">Chat</h3>
                            <Button variant="ghost" size="sm" onClick={toggleChat} className="h-8 w-8 p-0">
                                <MinimizeIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <ChatSection 
                            socket={socket} 
                            roomId={roomId}
                            //@ts-expect-error 
                            userId={userId}
                            username={username}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasComponent;