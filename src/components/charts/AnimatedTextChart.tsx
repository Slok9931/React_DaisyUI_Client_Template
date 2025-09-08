import React, { useEffect, useRef, useState } from 'react'

interface EChartsInstance {
    setOption: (option: any) => void
    resize: () => void
    dispose: () => void
}

interface AnimatedTextChartProps {
    text?: string
    fontSize?: number
    duration?: number
    strokeWidth?: number
    width?: string | number
    height?: string | number
    className?: string
    strokeColor?: string
    fillColor?: string
}

export const AnimatedTextChart: React.FC<AnimatedTextChartProps> = ({
    text = "Infinity",
    fontSize = 80,
    duration = 5000,
    strokeWidth = 1,
    width = "100%",
    height = "100%",
    className = "",
    strokeColor,
    fillColor
}) => {
    const chartRef = useRef<HTMLDivElement>(null)
    const chartInstance = useRef<EChartsInstance | null>(null)
    const [isEChartsLoaded, setIsEChartsLoaded] = useState(false)

    // Get CSS variables for theme colors
    const getThemeColor = (colorName: string) => {
        if (typeof window === 'undefined') return '#000'
        const computedStyle = getComputedStyle(document.documentElement)
        const hslValue = computedStyle.getPropertyValue(`--${colorName}`).trim()
        if (hslValue) {
            // Convert HSL to hex or return a default color
            return `hsl(${hslValue})`
        }
        return colorName === 'p' ? '#570df8' : '#1f2937' // fallback colors
    }

    // Load ECharts dynamically
    useEffect(() => {
        const loadECharts = async () => {
            try {
                // Load ECharts from CDN
                if (!(window as any).echarts) {
                    const script = document.createElement('script')
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js'
                    script.onload = () => {
                        setIsEChartsLoaded(true)
                    }
                    script.onerror = () => {
                        console.error('Failed to load ECharts')
                    }
                    document.head.appendChild(script)
                } else {
                    setIsEChartsLoaded(true)
                }
            } catch (error) {
                console.error('Error loading ECharts:', error)
            }
        }

        loadECharts()
    }, [])

    useEffect(() => {
        if (!isEChartsLoaded || !chartRef.current) return

        const echarts = (window as any).echarts
        chartInstance.current = echarts.init(chartRef.current)

        const themeStrokeColor = strokeColor || getThemeColor('p')
        const themeFillColor = fillColor || getThemeColor('bc')

        const option = {
            graphic: {
                elements: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        style: {
                            text: text,
                            fontSize: fontSize,
                            fontWeight: 'bold',
                            fontFamily: 'Courgette, fantasy',
                            lineDash: [0, 200],
                            lineDashOffset: 0,
                            fill: 'transparent',
                            stroke: themeStrokeColor,
                            lineWidth: strokeWidth,
                            shadowColor: themeStrokeColor,
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        },
                        keyframeAnimation: {
                            duration: duration,
                            loop: true,
                            keyframes: [
                                {
                                    percent: 0,
                                    style: {
                                        fill: 'transparent',
                                        lineDashOffset: 200,
                                        lineDash: [0, 200],
                                        shadowBlur: 5
                                    }
                                },
                                {
                                    percent: 0.7,
                                    style: {
                                        fill: 'transparent',
                                        lineDashOffset: 0,
                                        lineDash: [200, 0],
                                        shadowBlur: 15
                                    }
                                },
                                {
                                    percent: 0.8,
                                    style: {
                                        fill: 'transparent',
                                        shadowBlur: 20
                                    }
                                },
                                {
                                    percent: 1,
                                    style: {
                                        fill: themeFillColor,
                                        shadowBlur: 25
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        if (chartInstance.current) {
            chartInstance.current.setOption(option)
        }

        const handleResize = () => {
            if (chartInstance.current) {
                chartInstance.current.resize()
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [isEChartsLoaded, text, fontSize, duration, strokeWidth, strokeColor, fillColor])

    useEffect(() => {
        if (!chartInstance.current) return

        const themeStrokeColor = strokeColor || getThemeColor('p')
        const themeFillColor = fillColor || getThemeColor('bc')

        const option = {
            graphic: {
                elements: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        style: {
                            text: text,
                            fontSize: fontSize,
                            fontWeight: 'bold',
                            fontFamily: 'Courgette, fantasy',
                            lineDash: [0, 200],
                            lineDashOffset: 0,
                            fill: 'transparent',
                            stroke: themeStrokeColor,
                            lineWidth: strokeWidth,
                            shadowColor: themeStrokeColor,
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        },
                        keyframeAnimation: {
                            duration: duration,
                            loop: true,
                            keyframes: [
                                {
                                    percent: 0,
                                    style: {
                                        fill: 'transparent',
                                        lineDashOffset: 200,
                                        lineDash: [0, 200],
                                        shadowBlur: 5
                                    }
                                },
                                {
                                    percent: 0.7,
                                    style: {
                                        fill: 'transparent',
                                        lineDashOffset: 0,
                                        lineDash: [200, 0],
                                        shadowBlur: 15
                                    }
                                },
                                {
                                    percent: 0.8,
                                    style: {
                                        fill: 'transparent',
                                        shadowBlur: 20
                                    }
                                },
                                {
                                    percent: 1,
                                    style: {
                                        fill: themeFillColor,
                                        shadowBlur: 25
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        chartInstance.current.setOption(option)
    }, [text, fontSize, duration, strokeWidth, strokeColor, fillColor])

    useEffect(() => {
        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose()
            }
        }
    }, [])

    return (
        <div className={`relative ${className}`} style={{ width, height }}>
            <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}