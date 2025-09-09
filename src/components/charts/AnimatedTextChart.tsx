import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface EChartsInstance {
    setOption: (option: any, notMerge?: boolean) => void
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
    fontFamily?: string
    loop?: boolean
}

export const AnimatedTextChart: React.FC<AnimatedTextChartProps> = ({
    text = "Infinity",
    fontSize = 160,
    duration = 5000,
    strokeWidth = 1,
    width = "100%",
    height = "400px",
    className = "",
    strokeColor = "#570df8",
    fillColor = "black",
    fontFamily = "Courgette, fantasy",
    loop = true,
}) => {
    const chartRef = useRef<HTMLDivElement>(null)
    const chartInstance = useRef<EChartsInstance | null>(null)

    // Initialize chart
    useEffect(() => {
        if (!chartRef.current) return

        // Dispose existing chart if any
        if (chartInstance.current) {
            chartInstance.current.dispose()
        }

        // Initialize new chart instance
        chartInstance.current = echarts.init(chartRef.current)

        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose()
                chartInstance.current = null
            }
        }
    }, [])

    // Update chart options when props change
    useEffect(() => {
        if (!chartInstance.current) return

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
                            fontFamily: fontFamily,
                            lineDash: [0, 200],
                            lineDashOffset: 0,
                            fill: 'transparent',
                            stroke: strokeColor,
                            lineWidth: strokeWidth
                        },
                        keyframeAnimation: {
                            duration: duration,
                            loop: loop,
                            keyframes: [
                                {
                                    percent: 0.7,
                                    style: {
                                        fill: 'transparent',
                                        lineDashOffset: 200,
                                        lineDash: [200, 0]
                                    }
                                },
                                {
                                    percent: 0.8,
                                    style: {
                                        fill: 'transparent'
                                    }
                                },
                                {
                                    percent: 1,
                                    style: {
                                        fill: fillColor
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        chartInstance.current.setOption(option, true)
    }, [text, fontSize, duration, strokeWidth, strokeColor, fillColor, fontFamily, loop])

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (chartInstance.current) {
                chartInstance.current.resize()
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className={`relative ${className}`} style={{ width, height }}>
            <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}